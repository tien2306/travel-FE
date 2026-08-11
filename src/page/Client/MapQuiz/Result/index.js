import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.scss";

export default function Result() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  if (!state) return (
    <div className="result-page">
      <div className="result__container">
        <p>Không có dữ liệu bài làm.</p>
        <button className="result__retry" onClick={() => navigate("/map")}>Quay lại</button>
      </div>
    </div>
  );

  const { score, total, results } = state;

  return (
    <div className="result-page">
      <div className="result__container">
        <h2>Kết Quả Bài Thi</h2>

        <div className="result__summary">
          <div className="result__circle">
            <span>{score}</span>
            <small>/ {total} câu</small>
          </div>
          <p>Bạn trả lời đúng <strong>{score}</strong> / <strong>{total}</strong> câu.</p>
        </div>

        <div>
          {results.map((item, i) => (
            <div className={`result__item result__item--${item.isCorrect ? "correct" : "wrong"}`} key={i}>
              <p className="result__q-title">
                Câu {i + 1}: {item.question}
                <span className={`result__badge result__badge--${item.isCorrect ? "correct" : "wrong"}`}>
                  {item.isCorrect ? "Đúng" : "Sai"}
                </span>
              </p>
              <div className="result__answer-info">
                <span>Bạn chọn: <strong>{item.selectedAnswer}</strong></span>
                {!item.isCorrect && (
                  <span className="result__correct-ans"> · Đáp án: <strong>{item.correctAnswer}</strong></span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="result__retry" onClick={() => navigate("/map")}>Làm bài khác</button>
      </div>
    </div>
  );
}