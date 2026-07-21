import React from "react";
import { Row, Col, Card, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  SendOutlined,
} from "@ant-design/icons";
import BG from "../../../images/carousel-2.jpg";
import { IMAGE_URLS } from "../../../constants/api";

export default function TourList({ data }) {
  const navigate = useNavigate();
  const fallbackImage = BG;
  const urlImage = IMAGE_URLS.TOURS;

  return (
    <Row gutter={[0, 20]}>
      {data?.map((tour) => {
        const totalSeats = tour.quantity || 30;
        const soldSeats = tour.sold || 0;
        const availableSeats = totalSeats - soldSeats;
        const percentSold = Math.round((soldSeats / totalSeats) * 100);

        return (
          <Col key={tour.id || tour._id} span={24}>
            <Card
              hoverable
              className="tour-card tour-card--list-mode"
              onClick={() => navigate(`/tours/${tour.slug}`)}
            >
              {/* Khối ảnh bên trái */}
              <div className="tour-card__hero">
                {/* Badge trạng thái */}
                <span className={`tour-card__status-badge ${tour.status !== "ACTIVE" ? "status-inactive" : availableSeats <= 0 ? "status-full" : "status-available"}`}>
                  {tour.status !== "ACTIVE" ? "Tạm ngưng" : availableSeats <= 0 ? "Hết chỗ" : "Còn chỗ"}
                </span>

                <img
                  src={urlImage + tour.thumbnail || fallbackImage}
                  alt=""
                  className="tour-card__img"
                  onError={(e) => {
                    e.target.onerror = null;
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
                  <span>Còn {availableSeats} chỗ</span>
                </div>
              </div>

              {/* Khối nội dung bên phải */}
              <div className="tour-card__body">
                <div className="tour-card__main-content">
                  <h3 className="tour-card__title">{tour.name}</h3>

                  {/* Thanh tiến trình lượng đặt vé */}
                  <div
                    className="tour-card__progress-block"
                    style={{ maxWidth: "250px" }}
                  >
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

                  {/* Lưới thông tin chi tiết (Đã bỏ Mã tour thừa) */}
                  <div className="tour-card__grid-info">
                    <div className="tour-card__info-item">
                      <EnvironmentOutlined /> Nơi khởi hành:{" "}
                      {tour.departurePlace === "Ho Chi Minh City"
                        ? "TP. HCM"
                        : tour.departurePlace}
                    </div>
                    <div className="tour-card__info-item">
                      <CalendarOutlined /> Thời gian:{" "}
                      {tour.shortDesc || "3 Ngày 2 Đêm"}
                    </div>
                    <div
                      className="tour-card__info-item"
                      style={{ gridColumn: "span 2" }}
                    >
                      <SendOutlined /> Điểm đến du lịch: {tour.destination}
                    </div>
                  </div>
                </div>

                {/* Khối lịch khởi hành */}
                <div className="tour-card__date-section">
                  <span className="tour-card__date-label">
                    📅 Ngày khởi hành:
                  </span>
                  <div className="tour-card__date-list">
                    <span className="tour-card__date-badge">
                      {new Date(tour.startDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                {/* Khối giá tiền và nút chi tiết dưới đáy */}
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
                  <span className="tour-card__more-badge">Xem chi tiết</span>
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
