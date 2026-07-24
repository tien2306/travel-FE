import React from "react";
import { Row, Col, Card, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import BG from "../../../images/carousel-1.jpg";
import { IMAGE_URLS } from "../../../constants/api";

export default function TourGrid({ data }) {
  const navigate = useNavigate();

  // Tạo chuỗi ảnh SVG mặc định an toàn để thay thế khi ảnh API bị trống hoặc lỗi tải
  const fallbackImage = BG;
  const urlImage = IMAGE_URLS.TOURS;

  return (
    <Row gutter={[24, 24]}>
      {data?.map((tour) => {
        return (
          <Col key={tour.id || tour._id} xs={12} sm={12} md={12} lg={12} xl={8}>
            <Card
              hoverable
              className="tour-card"
              onClick={() => navigate(`/tours/${tour.slug}`)}
            >
              <div className="tour-card__hero">
                {/* Badge trạng thái ở góc trái trên cùng (Style như 'Giá tốt' trong mẫu) */}
                <span
                  className={`tour-card__status-badge ${tour.availableSeats <= 0 ? "status-full" : tour.isAvailable ? "status-available" : "status-closed"}`}
                >
                  {tour.availableSeats <= 0
                    ? "Hết Chỗ"
                    : tour.isAvailable
                      ? "Còn Chỗ"
                      : "Ngưng Nhận"}
                </span>

                <img
                  src={
                    tour.thumbnail ? urlImage + tour.thumbnail : fallbackImage
                  }
                  alt=""
                  className="tour-card__img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />

                <div className="tour-card__score-bar">
                  <span>
                    📍 Khởi hành:{" "}
                    {tour.departurePlace === "Ho Chi Minh City"
                      ? "TP. HCM"
                      : tour.departurePlace}
                  </span>
                  <span>📍 Điểm đến: {tour.destination}</span>
                </div>
              </div>

              <div className="tour-card__body">
                <div className="tour-card__floating-content">
                  {/* Title */}
                  <h3 className="tour-card__title">{tour.name}</h3>

                  <div className="tour-card__progress-block">
                    <Progress
                      percent={tour.bookedPercentage}
                      size="small"
                      status="active"
                      showInfo={false}
                      strokeColor={
                        tour.bookedPercentage > 74
                          ? { "0%": "#fa8c16", "100%": "#ff4d4f" }
                          : { "0%": "#108ee9", "100%": "#87d068" }
                      }
                    />
                    <span className="tour-card__progress-text">
                      Đã đặt {tour.bookedPercentage}%
                    </span>
                  </div>

                  <p className="tour-card__short-desc">
                    {tour.shortDesc ||
                      "Trải nghiệm chuyến du lịch tuyệt vời cùng gia đình và người thân."}
                  </p>

                  <div className="tour-card__date-block">
                    <span className="tour-card__icon">📅</span>
                    <span className="tour-card__date-label">
                      Lịch khởi hành:
                    </span>
                    <span className="tour-card__date-badge-accent">
                      {new Date(tour.startDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="tour-card__route-mobile">
                    <span className="tour-card__icon">📍</span>
                    <span className="tour-card__route-label">Lịch trình:</span>
                    <span className="tour-card__route-value">
                      {tour.departurePlace} ➔ {tour.destination}
                    </span>
                  </div>

                  <div className="tour-card__footer">
                    <div className="tour-card__price-section">
                      <span className="tour-card__price-label">Giá từ:</span>
                      <span className="tour-card__price-value">
                        {Number(tour.price).toLocaleString("vi-VN")}
                        <span className="tour-card__price-unit">đ</span>
                      </span>
                    </div>
                    <span className="tour-card__more-badge">Xem chi tiết</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
