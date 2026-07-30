import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Rate, Input, Select, Pagination, Upload, Button, Image } from "antd";
import { UploadOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./TourReviews.scss";

const { TextArea } = Input;
const { Option } = Select;

// ─── Dữ liệu giả lập 15 đánh giá ────────────────────────────────────────────
const MOCK_REVIEWS = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: `Khách hàng ${i + 1}`,
  rating: i % 3 === 0 ? 4 : 5,
  content: "Trải nghiệm tuyệt vời, dịch vụ chu đáo. Hướng dẫn viên rất nhiệt tình và vui vẻ. Sẽ quay lại lần sau!",
  date: `1${(i % 9) + 1}/07/2026`,
  images: i % 4 === 0
    ? [`https://picsum.photos/300/200?random=${i}`, `https://picsum.photos/300/200?random=${i + 1}`]
    : [],
  reply: i % 5 === 0
    ? "TravelApp xin cảm ơn đánh giá của bạn. Rất mong được đồng hành cùng bạn trong các chuyến đi tiếp theo!"
    : "",
  replyTime: i % 5 === 0 ? `1${(i % 9) + 2}/07/2026` : "",
}));
// ─────────────────────────────────────────────────────────────────────────────

// ─── API mẫu ─────────────────────────────────────────────────────────────────
const reviewApi = {
  // POST /reviews  { tourId, rating, content, images }
  // NOTE: dùng POST — gửi body JSON lên server
  submit: (payload) => {
    console.log("[API] POST /reviews →", payload);
    // TODO: return axios.post("/reviews", payload);
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const TourReviews = () => {
  const listRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin } = useSelector((state) => state.loginReducer);
  const { t } = useTranslation("tours");

  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Tính trung bình sao
  const totalStar = reviews.reduce((s, r) => s + r.rating, 0);
  const avgStar = MOCK_REVIEWS.length > 0 ? (totalStar / MOCK_REVIEWS.length).toFixed(2) : 0;

  // Lọc
  const filtered = reviews.filter((r) => {
    if (filter === "all") return true;
    if (filter === "media") return r.images?.length > 0;
    return Math.floor(r.rating) === parseInt(filter);
  });

  // Phân trang
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Yêu cầu đăng nhập
  const requireLogin = () => {
    Swal.fire({
      title: t("detail.rvLoginTitle"),
      text: t("detail.rvLoginText"),
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#0062cc",
      cancelButtonColor: "#888",
      confirmButtonText: t("detail.qaLoginBtn"),
      cancelButtonText: t("detail.qaCloseBtn"),
    }).then((res) => {
      if (res.isConfirmed) navigate("/login", { state: { from: location.pathname } });
    });
  };

  // Submit đánh giá
  const handleSubmit = () => {
    if (!content.trim()) return;

    const payload = { rating, content };

    // Gọi API mẫu (POST /reviews)
    reviewApi.submit(payload);

    // Thêm vào list local để hiện ngay
    setReviews([{ id: Date.now(), name: "Khách hàng hiện tại", rating, content, date: "Vừa xong", images: [], reply: "", replyTime: "" }, ...reviews]);
    setContent("");
    setRating(5);
    setShowForm(false);
    setPage(1);

    Swal.fire({ icon: "success", title: "Gửi đánh giá thành công", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
  };

  // Cuộn về đầu section khi đổi trang
  const handlePageChange = (p) => {
    setPage(p);
    if (listRef.current) {
      const y = listRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div id="tour-reviews" className="tour-reviews" ref={listRef}>

      {/* Header: điểm + bộ lọc */}
      <div className="tour-reviews__header">
        <div className="tour-reviews__score">
          <h3 className="tour-reviews__score-num">{avgStar}</h3>
          <Rate disabled value={parseFloat(avgStar)} allowHalf />
          <p className="tour-reviews__count">{t("detail.rvBasedOn", { count: MOCK_REVIEWS.length })}</p>
        </div>

        <div className="tour-reviews__controls">
          <Select
            defaultValue="all"
            style={{ width: 170 }}
            onChange={(val) => { setFilter(val); setPage(1); }}
          >
            <Option value="all">{t("detail.rvFilterAll")}</Option>
            <Option value="media">{t("detail.rvFilterMedia")}</Option>
            {[5, 4, 3, 2, 1].map((s) => (
              <Option key={s} value={String(s)}>{t("detail.rvFilterStar", { count: s })}</Option>
            ))}
          </Select>

          <button
            className="tour-reviews__btn-write"
            onClick={() => {
              if (!isLogin) { requireLogin(); return; }
              setShowForm(!showForm);
            }}
          >
            {showForm ? t("detail.rvCancelBtn") : t("detail.rvWriteBtn")}
          </button>
        </div>
      </div>

      {/* Form viết đánh giá */}
      {showForm && (
        <div className="tour-reviews__form">
          <h4 className="tour-reviews__form-title">{t("detail.rvFormTitle")}</h4>
          <div className="tour-reviews__form-rating">
            <span>{t("detail.rvFormLabel")}</span>
            <Rate value={rating} onChange={setRating} />
          </div>
          <TextArea
            rows={3}
            placeholder={t("detail.rvFormPlaceholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="tour-reviews__form-upload">
            <Upload listType="picture" maxCount={5} multiple beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>{t("detail.rvFormUpload")}</Button>
            </Upload>
          </div>
          <button className="tour-reviews__btn-submit" onClick={handleSubmit}>
            {t("detail.rvFormSubmit")}
          </button>
        </div>
      )}

      {/* Danh sách */}
      <div className="tour-reviews__list">
        {paged.length > 0 ? (
          paged.map((rv) => (
            <div key={rv.id} className="tour-reviews__item">
              <div className="tour-reviews__avatar">{rv.name.charAt(0)}</div>
              <div className="tour-reviews__body">
                <div className="tour-reviews__meta">
                  <strong className="tour-reviews__username">{rv.name}</strong>
                  <span className="tour-reviews__date">{rv.date}</span>
                </div>
                <Rate disabled defaultValue={rv.rating} className="tour-reviews__stars" style={{ fontSize: 14 }} />
                <p className="tour-reviews__content">{rv.content}</p>

                {rv.images?.length > 0 && (
                  <div className="tour-reviews__images">
                    <Image.PreviewGroup>
                      {rv.images.map((img, idx) => (
                        <Image key={idx} src={img} width={80} height={80} style={{ objectFit: "cover", borderRadius: 4 }} />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                )}

                {rv.reply && (
                  <div className="tour-reviews__reply">
                    <div className="tour-reviews__reply-header">
                      <strong>Quản Trị Viên <span className="tour-reviews__badge-admin">QTV</span></strong>
                      <span className="tour-reviews__date"><ClockCircleOutlined /> {rv.replyTime}</span>
                    </div>
                    <p>{rv.reply}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="tour-reviews__empty">{t("detail.rvNoReview")}</p>
        )}
      </div>

      {/* Phân trang */}
      {filtered.length > PAGE_SIZE && (
        <div className="tour-reviews__pagination">
          <Pagination
            current={page}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default TourReviews;
