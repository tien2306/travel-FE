import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Swal from "sweetalert2";
import "./Quiz.scss";
import localData from "../vietnam-data.json";

// Mã tỉnh giả định theo miền (Demo 1 vài tỉnh đại diện, thực tế cần list đầy đủ 63 tỉnh)
// Khai báo chuẩn và đầy đủ 63 tỉnh thành Việt Nam (Không sót tỉnh nào)
const MIEN_BAC = [
  1, 2, 4, 6, 8, 10, 11, 12, 14, 15, 17, 19, 20, 22, 24, 25, 26, 27, 30, 31, 33,
  34, 35, 36, 37,
];
const MIEN_TRUNG = [
  38, 40, 42, 44, 45, 46, 48, 49, 51, 52, 54, 56, 58, 60, 62, 64, 66, 67, 68,
];
const MIEN_NAM = [
  70, 72, 74, 75, 77, 79, 80, 82, 83, 84, 86, 87, 89, 91, 92, 93, 94, 95, 96,
];

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sử dụng trực tiếp dữ liệu từ file database.json
    try {
      const { provinces, wards } = localData;
      let filteredData = provinces;

      // Lọc theo Vùng Miền
      if (id === "mien-bac")
        filteredData = provinces.filter((p) => MIEN_BAC.includes(p.code));
      if (id === "mien-trung")
        filteredData = provinces.filter((p) => MIEN_TRUNG.includes(p.code));
      if (id === "mien-nam")
        filteredData = provinces.filter((p) => MIEN_NAM.includes(p.code));

      if (filteredData.length === 0) filteredData = provinces;

      let questionPool = [];

      // TỐI ƯU CỐT LÕI: Tạo sẵn danh sách tên toàn bộ các tỉnh thành để làm đáp án sai dùng chung
      const allProvinceNames = provinces.map((x) => x.name);

      // Xây dựng câu hỏi từ danh sách wards (xã/phường)
      wards.forEach((w) => {
        const p = filteredData.find((prov) => prov.code === w.province_code);
        if (p) {
          questionPool.push({
            targetName: w.name,
            correctAnswer: p.name,
            // Chỉ lấy danh sách các tỉnh khác tỉnh hiện tại
            wrongPool: allProvinceNames.filter((name) => name !== p.name),
          });
        }
      });

      // Random bốc ra 10 câu hỏi
      const shuffledPool = questionPool
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

      const generatedQuestions = shuffledPool.map((qData, idx) => {
        const wrongAnswers = qData.wrongPool
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const options = [qData.correctAnswer, ...wrongAnswers].sort(
          () => 0.5 - Math.random(),
        );

        return {
          id: idx + 1,
          question: `${qData.targetName} thuộc tỉnh/thành phố nào?`,
          answers: options,
          correctAnswer: qData.correctAnswer,
        };
      });

      setQuestions(generatedQuestions);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi load dữ liệu local:", err);
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    let answeredCount = 0;
    questions.forEach((q) => {
      if (formData.get(q.id.toString())) answeredCount++;
    });

    const processAndNavigate = () => {
      let score = 0;
      let results = [];

      questions.forEach((q) => {
        const selectedAnswer = formData.get(q.id.toString());
        const isCorrect = selectedAnswer === q.correctAnswer;
        if (isCorrect) score++;

        results.push({
          questionId: q.id,
          question: q.question,
          selectedAnswer: selectedAnswer || "Chưa trả lời",
          correctAnswer: q.correctAnswer,
          isCorrect,
        });
      });

      navigate(`/map/result/${id}`, {
        state: { score, total: questions.length, results },
      });
    };

    if (answeredCount < questions.length) {
      Swal.fire({
        title: "Chưa hoàn thành!",
        text: `Bạn mới trả lời ${answeredCount}/${questions.length} câu. Bạn có chắc chắn muốn nộp bài?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Nộp luôn",
        cancelButtonText: "Làm tiếp",
      }).then((result) => {
        if (result.isConfirmed) {
          processAndNavigate();
        }
      });
    } else {
      Swal.fire({
        title: "Hoàn thành!",
        text: "Đang tính điểm...",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        processAndNavigate();
      });
    }
  };

  const getTitle = () => {
    switch (id) {
      case "toan-quoc":
        return "Cực Khó: Toàn Việt Nam";
      case "mien-bac":
        return "Trùm: Miền Bắc";
      case "mien-trung":
        return "Trùm: Miền Trung";
      case "mien-nam":
        return "Trùm: Miền Nam";
      default:
        return "Trắc Nghiệm Cực Khó";
    }
  };

  return (
    <div className="quiz-page">
      <div className="quiz__container">
        <button className="quiz__back" onClick={() => navigate("/map")}>
          ← Quay lại Sảnh
        </button>
        <div className="quiz__header">
          <h2>{getTitle()}</h2>
          <p>Hoàn thành tất cả câu hỏi dưới đây để kiểm tra kiến thức địa lý của bạn!</p>
        </div>

        {loading ? (
          <div className="quiz__loading">
            <Spin size="large" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((item, index) => (
              <div className="quiz__item" key={item.id}>
                <div className="quiz__question-text">
                  <span className="q-num">Câu {index + 1}</span> 
                  <span>{item.question}</span>
                </div>
                <div className="quiz__answers">
                  {item.answers.map((ans, i) => (
                    <label className="quiz__answer" htmlFor={`quiz-${item.id}-${i}`} key={i}>
                      <input id={`quiz-${item.id}-${i}`} type="radio" name={item.id} value={ans} />
                      <div className="radio-custom"></div>
                      <span className="answer-text">{ans}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button className="quiz__submit">Nộp bài</button>
          </form>
        )}
      </div>
    </div>
  );
}
