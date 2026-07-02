import React from "react";
import { Row, Col, Card, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import BG from "../../images/carousel-1.jpg";

export default function TourGrid({ data }) {
  const navigate = useNavigate();

  // Tạo chuỗi ảnh SVG mặc định an toàn để thay thế khi ảnh API bị trống hoặc lỗi tải
  const fallbackImage = BG;

  return (
    <Row gutter={[24, 24]}>
      {data?.map((tour) => {
        const totalSeats = tour.quantity || 30;
        const soldSeats = tour.sold || 0;
        const availableSeats = totalSeats - soldSeats;
        const percentSold = Math.round((soldSeats / totalSeats) * 100);

        return (
          <Col key={tour.id || tour._id} span={8} xs={24} md={12} lg={8}>
            <Card
              hoverable
              className="tour-card"
              onClick={() => navigate(`/tours/slug/${tour.slug}`)}
            >
              <div className="tour-card__hero">
                <img
                  src={tour.image || fallbackImage}
                  alt=""
                  className="tour-card__img"
                  onError={(e) => {
                    // Bẻ gãy vòng lặp vô hạn lập tức bằng cách chặn sự kiện onError tiếp theo
                    e.target.onerror = null;
                    // Đổi sang ảnh SVG dự phòng an toàn
                    e.target.src = fallbackImage;
                  }}
                />

                <span className="tour-card__departure-badge">
                  📍 Khởi hành:{" "}
                  {tour.departurePlace === "Ho Chi Minh City"
                    ? "TP. HCM"
                    : tour.departurePlace}
                </span>

                <div className="tour-card__score-bar">
                  <span>📍 Điểm đến: {tour.destination}</span>
                  <span>Còn {availableSeats} chỗ</span>
                </div>
              </div>

              <div className="tour-card__body">
                <h3 className="tour-card__title">{tour.name}</h3>

                <div className="tour-card__progress-block">
                  <Progress
                    percent={percentSold}
                    size="small"
                    status="active"
                    showInfo={false}
                    strokeColor={
                      percentSold > 74
                        ? { "0%": "#fa8c16", "100%": "#ff4d4f" }
                        : { "0%": "#108ee9", "100%": "#87d068" }
                    }
                  />
                  <span className="tour-card__progress-text">
                    Đã đặt {percentSold}%
                  </span>
                </div>

                <p className="tour-card__short-desc">
                  {tour.shortDesc ||
                    "Trải nghiệm chuyến du lịch tuyệt vời cùng gia đình và người thân."}
                </p>

                <div className="tour-card__date-block">
                  <span className="tour-card__date-label">
                    📅 Lịch khởi hành:
                  </span>
                  <span className="tour-card__date-badge-accent">
                    {new Date(tour.startDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="tour-card__footer">
                  <div className="tour-card__price-section">
                    <span className="tour-card__price-label">
                      Giá trọn gói từ:
                    </span>
                    <span className="tour-card__price-value">
                      {Number(tour.price).toLocaleString("vi-VN")}
                      <span className="tour-card__price-unit">đ</span>
                    </span>
                  </div>
                  <span className="tour-card__more-badge">Chi tiết</span>
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
