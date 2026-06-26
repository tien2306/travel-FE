import React from "react";
import { Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  BarcodeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { getDuration } from "../../helpers/dateTime";

export default function TourList(props) {
  const { data } = props;
  const navigate = useNavigate();

  return (
    <Row gutter={[24, 24]}>
      {data.map((tour) => {
        return (
          <Col key={tour.id} span={24} xs={24} md={24} lg={24}>
            <Card
              hoverable
              className="tour-card tour-card--list-mode"
              onClick={() => navigate(`/tours/slug/${tour.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="tour-card__hero">
                <img
                  src={tour.image || "https://laodong.vn"}
                  alt={tour.name}
                  className="tour-card__img"
                />
                <div className="tour-card__score-bar">
                  <span>
                    Còn trống: {tour.quantity - tour.sold} chỗ | Đã bán:{" "}
                    {tour.sold}
                  </span>
                  <span className="tour-card__quick-view">👁 Xem nhanh</span>
                </div>
              </div>

              <div className="tour-card__body">
                <h3 className="tour-card__title">{tour.name}</h3>

                <div className="tour-card__grid-info">
                  <div className="tour-card__info-item">
                    <BarcodeOutlined /> Mã chương trình:{" "}
                    {tour.id ? tour.id.substring(0, 8).toUpperCase() : "EASY"}
                  </div>
                  <div className="tour-card__info-item">
                    <EnvironmentOutlined /> Điểm khởi hành:{" "}
                    {tour.departurePlace}
                  </div>
                  <div className="tour-card__info-item">
                    <CalendarOutlined /> Thời gian:{" "}
                    {getDuration(tour.startDate, tour.endDate)}
                  </div>
                  <div className="tour-card__info-item">
                    <SendOutlined /> Điểm đến: {tour.destination}
                  </div>
                </div>

                <div className="tour-card__date-section">
                  <span className="tour-card__date-label">
                    📅 Ngày khởi hành:
                  </span>
                  <div className="tour-card__date-list">
                    <span className="tour-card__date-badge">
                      {new Date(tour.startDate)
                        .toLocaleDateString("vi-VN")
                        .substring(0, 5)}
                    </span>
                  </div>
                </div>

                <div className="tour-card__footer">
                  <div className="tour-card__price-section">
                    <span className="tour-card__price-label">Giá từ:</span>
                    <span className="tour-card__price-value">
                      {Number(tour.price).toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {/* ĐỔI THÀNH TAG TEXT BO TRÒN DÍNH GÓC THEO ẢNH MẪU */}
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
