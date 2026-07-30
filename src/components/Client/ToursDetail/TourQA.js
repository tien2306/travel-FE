import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Input, Pagination } from "antd";
import { useTranslation } from "react-i18next";
import "./TourQA.scss";

// ─── Dữ liệu giả lập 15 câu hỏi ─────────────────────────────────────────────
const MOCK_QA = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  user: `Khách hàng ${i + 1}`,
  question: i % 2 === 0
    ? "Tour này có đón khách ở sân bay không ạ?"
    : "Chào bạn cho mình hỏi là nếu mình ăn chay thì có menu riêng không ạ?",
  time: `${(i % 5) + 1} ngày trước`,
  replies: i % 3 === 0
    ? [
        { id: parseInt(`${i + 1}01`), user: "TravelApp", isAdmin: true, content: "Dạ bên em có hỗ trợ xe đưa rước tại sân bay nhé.\nNhân viên sẽ liên hệ lại để chốt giờ đón cho mình nhé.\nCảm ơn mình đã quan tâm đến TravelApp.", time: `${(i % 5) + 1} ngày trước` },
        { id: parseInt(`${i + 1}02`), user: "Khách hàng A", isAdmin: false, content: "Đợt trước mình đi cũng được đưa đón tận nơi nha bạn", time: "Vừa xong" },
      ]
    : i % 2 === 0
      ? [{ id: parseInt(`${i + 1}03`), user: "Quản Trị Viên", isAdmin: true, content: "TravelApp xin chào bạn!\nDạ có menu chay riêng ạ, vui lòng báo trước lúc đặt vé nhé.\nThân mến", time: "1 giờ trước" }]
      : [],
}));
// ─────────────────────────────────────────────────────────────────────────────

// ─── API mẫu ─────────────────────────────────────────────────────────────────
const qaApi = {
  // POST /questions  { content }
  // NOTE: dùng POST — gửi body JSON lên server
  ask: (payload) => {
    console.log("[API] POST /questions →", payload);
    // TODO: return axios.post("/questions", payload);
  },
  // POST /questions/:questionId/replies  { content }
  // NOTE: dùng POST — gửi body JSON lên server
  reply: (questionId, payload) => {
    console.log(`[API] POST /questions/${questionId}/replies →`, payload);
    // TODO: return axios.post(`/questions/${questionId}/replies`, payload);
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── Component con: 1 thread Q&A ─────────────────────────────────────────────
const QAItem = ({ qa, onRequireLogin, t }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [activeId, setActiveId] = useState(null); // id đang reply
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(qa.replies || []);

  const openReply = (id) => {
    if (onRequireLogin()) {
      setActiveId(id);
      setReplyText("");
      if (id !== qa.id) setShowReplies(true);
    }
  };

  const handleSubmitReply = (targetId) => {
    if (!replyText.trim()) return;

    const payload = { content: replyText };
    qaApi.reply(targetId, payload);

    setReplies([...replies, { id: Date.now(), user: "Khách hàng hiện tại", isAdmin: false, content: replyText, time: "Vừa xong" }]);
    setShowReplies(true);
    setActiveId(null);
    setReplyText("");

    Swal.fire({ icon: "success", title: "Gửi phản hồi thành công", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
  };

  const handleReport = () => {
    if (!onRequireLogin()) return;
    Swal.fire({
      title: "Báo cáo vi phạm",
      input: "textarea",
      inputLabel: "Lý do báo cáo nội dung này:",
      inputPlaceholder: "Ví dụ: Ngôn từ đả kích, spam, quảng cáo trái phép...",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#888",
      confirmButtonText: t("detail.qaReport"),
      cancelButtonText: t("detail.qaCancel"),
      inputValidator: (v) => !v ? "Vui lòng nhập lý do báo cáo!" : null,
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({ icon: "success", title: "Đã gửi báo cáo", text: "Cảm ơn bạn. Quản trị viên sẽ kiểm tra nội dung này.", toast: true, position: "top-end", showConfirmButton: false, timer: 3000 });
      }
    });
  };

  // Form nhập reply (dùng lại ở cả câu hỏi chính lẫn reply con)
  const ReplyInput = ({ targetId }) => (
    <div className="qa-item__reply-input">
      <div className="qa-item__avatar qa-item__avatar--sm">U</div>
      <div className="qa-item__input-wrap">
        <Input.TextArea
          placeholder={t("detail.qaReplyPlaceholder")}
          autoSize={{ minRows: 1, maxRows: 4 }}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <div className="qa-item__input-actions">
          <span className="qa-item__btn-cancel" onClick={() => setActiveId(null)}>{t("detail.qaCancel")}</span>
          <span
            className={`qa-item__btn-send${replyText.trim() ? " qa-item__btn-send--active" : ""}`}
            onClick={() => handleSubmitReply(targetId)}
          >
            {t("detail.qaReply")}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="qa-item">
      {/* Câu hỏi chính */}
      <div className="qa-item__main">
        <div className="qa-item__avatar">{qa.user.charAt(0)}</div>
        <div className="qa-item__content">
          <div className="qa-item__meta">
            <strong className="qa-item__username">{qa.user}</strong>
            <span className="qa-item__time">{qa.time}</span>
          </div>
          <p className="qa-item__text">{qa.question}</p>
          <div className="qa-item__actions">
            <span className="qa-item__btn-action" onClick={() => openReply(qa.id)}>{t("detail.qaReply")}</span>
            <span className="qa-item__btn-action qa-item__btn-action--report" onClick={handleReport}>{t("detail.qaReport")}</span>
          </div>
          {activeId === qa.id && <ReplyInput targetId={qa.id} />}
        </div>
      </div>

      {/* Danh sách replies */}
      {replies.length > 0 && (
        <div className="qa-item__replies">
          {!showReplies ? (
            <button className="qa-item__btn-toggle" onClick={() => setShowReplies(true)}>
              <span className="qa-item__toggle-icon">▼</span>{" "}
              {t("detail.qaViewReplies", { count: replies.length })}
            </button>
          ) : (
            <div className="qa-item__replies-list">
              {replies.map((rep) => (
                <div key={rep.id} className="qa-item__reply">
                  <div className="qa-item__avatar qa-item__avatar--sm">{rep.user.charAt(0)}</div>
                  <div className="qa-item__content">
                    <div className="qa-item__meta">
                      <strong className="qa-item__username">
                        {rep.user}
                        {rep.isAdmin && <span className="qa-item__badge-admin">QTV</span>}
                      </strong>
                      <span className="qa-item__time">{rep.time}</span>
                    </div>
                    <div className="qa-item__text">
                      {rep.content.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                    <div className="qa-item__actions">
                      <span className="qa-item__btn-action" onClick={() => openReply(rep.id)}>{t("detail.qaReply")}</span>
                      <span className="qa-item__btn-action qa-item__btn-action--report" onClick={handleReport}>{t("detail.qaReport")}</span>
                    </div>
                    {activeId === rep.id && <ReplyInput targetId={rep.id} />}
                  </div>
                </div>
              ))}
              <button className="qa-item__btn-toggle" onClick={() => setShowReplies(false)}>
                <span className="qa-item__toggle-icon">▲</span>{" "}
                {t("detail.qaHideReplies")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const TourQA = () => {
  const sectionRef = useRef(null);
  const { isLogin } = useSelector((state) => state.loginReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("tours");

  const [qaList, setQaList] = useState(MOCK_QA);
  const [question, setQuestion] = useState("");
  const [page, setPage] = useState(1);

  const paged = qaList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Yêu cầu đăng nhập
  const requireLogin = () => {
    if (!isLogin) {
      Swal.fire({
        title: t("detail.qaLoginTitle"),
        text: t("detail.qaLoginText"),
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#0062cc",
        cancelButtonColor: "#888",
        confirmButtonText: t("detail.qaLoginBtn"),
        cancelButtonText: t("detail.qaCloseBtn"),
      }).then((res) => {
        if (res.isConfirmed) navigate("/login", { state: { from: location.pathname } });
      });
      return false;
    }
    return true;
  };

  // Gửi câu hỏi
  const handleAsk = () => {
    if (!requireLogin()) return;
    if (!question.trim()) return;

    const payload = { content: question };
    qaApi.ask(payload);

    setQaList([{ id: Date.now(), user: "Khách hàng hiện tại", question, time: "Vừa xong", replies: [] }, ...qaList]);
    setQuestion("");
    setPage(1);

    Swal.fire({ icon: "success", title: "Gửi câu hỏi thành công", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
  };

  const handlePageChange = (p) => {
    setPage(p);
    if (sectionRef.current) {
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div id="tour-qa" className="tour-qa" ref={sectionRef}>

      {/* Form đặt câu hỏi */}
      <div className="tour-qa__form">
        <p className="tour-qa__form-label">{t("detail.qaTitle")}</p>
        <Input.TextArea
          rows={3}
          placeholder={t("detail.qaPlaceholder")}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="tour-qa__btn-ask" onClick={handleAsk}>
          {t("detail.qaSubmit")}
        </button>
      </div>

      {/* Danh sách Q&A */}
      <div className="tour-qa__list">
        {paged.map((qa) => (
          <QAItem key={qa.id} qa={qa} onRequireLogin={requireLogin} t={t} />
        ))}
      </div>

      {/* Phân trang */}
      {qaList.length > PAGE_SIZE && (
        <div className="tour-qa__pagination">
          <Pagination
            current={page}
            total={qaList.length}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default TourQA;
