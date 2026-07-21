import React from "react";
import { Rate, Input } from "antd";
import "./TourReviews.scss";

const { TextArea } = Input;

const DUMMY_REVIEWS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    rating: 5,
    content: "Tour rất tuyệt vời, hướng dẫn viên nhiệt tình, đồ ăn ngon!",
    date: "20/07/2026",
  },
  {
    id: 2,
    name: "Trần Thị B",
    rating: 4,
    content: "Khá ổn, tuy nhiên khách sạn hơi xa trung tâm một chút xíu.",
    date: "18/07/2026",
  },
];

const TourReviews = () => {
  return (
    <div id="tour-reviews" className="tour-reviews-section">
      <h2 className="section-title">Đánh giá khách hàng</h2>
      
      <div className="review-summary">
        <div className="avg-rating">
          <h3>4.5</h3>
          <Rate disabled defaultValue={4.5} allowHalf />
          <p>Dựa trên 2 đánh giá</p>
        </div>
        
        <div className="review-form">
          <h4>Gửi đánh giá của bạn</h4>
          <div className="form-group">
            <span>Chọn sao: </span>
            <Rate defaultValue={5} />
          </div>
          <TextArea rows={3} placeholder="Mời bạn chia sẻ cảm nhận về tour..." />
          <button className="btn-submit-review">Gửi đánh giá</button>
        </div>
      </div>

      <div className="review-list">
        {DUMMY_REVIEWS.map((rv) => (
          <div key={rv.id} className="review-item">
            <div className="reviewer-info">
              <div className="r-avatar">{rv.name.charAt(0)}</div>
              <div>
                <strong className="r-name">{rv.name}</strong>
                <div className="r-time">{rv.date}</div>
              </div>
            </div>
            <div className="r-rating">
              <Rate disabled defaultValue={rv.rating} style={{ fontSize: 14 }} />
            </div>
            <div className="r-content">{rv.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourReviews;
