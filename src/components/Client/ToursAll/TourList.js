import React from "react";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  CarOutlined,
  StarOutlined,
} from "@ant-design/icons";
import BG from "../../../images/carousel-2.jpg";
import { IMAGE_URLS } from "../../../constants/api";
import "./TourList.scss";

export default function TourList({ data }) {
  const navigate = useNavigate();
  const fallbackImage = BG;
  const urlImage = IMAGE_URLS.TOURS;

  return (
    <div className="tour-list-container">
      {data?.map((tour) => {
        return (
          <div
            key={tour.id || tour._id}
            className="tour-list-card"
            onClick={() => navigate(`/tours/${tour.slug}`)}
          >
            {/* Cột trái: Ảnh */}
            <div className="tour-list-card__image-col">
              <img
                src={tour.thumbnail ? urlImage + tour.thumbnail : fallbackImage}
                alt={tour.name}
                className="tour-list-card__img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
              />
              <span
                className={`tour-list-card__status ${
                  tour.availableSeats <= 0
                    ? "status-full"
                    : tour.isAvailable
                      ? "status-available"
                      : "status-closed"
                }`}
              >
                {tour.availableSeats <= 0
                  ? "Hết Chỗ"
                  : tour.isAvailable
                    ? "Còn Chỗ"
                    : "Ngưng Nhận"}
              </span>
            </div>

            {/* Cột giữa: Thông tin chính */}
            <div className="tour-list-card__info-col">
              <h3 className="tour-list-card__title">{tour.name}</h3>

              <div className="tour-list-card__tags">
                {tour.transport && (
                  <span className="tour-list-card__tag">
                    <CarOutlined />{" "}
                    {tour.transport === "BUS"
                      ? "Xe Khách"
                      : tour.transport === "AIRPLANE"
                        ? "Máy Bay"
                        : tour.transport}
                  </span>
                )}
                {tour.category && (
                  <span
                    className={`tour-list-card__tag ${
                      tour.category === "PREMIUM"
                        ? "tour-list-card__tag--orange"
                        : tour.category === "SAVING"
                          ? "tour-list-card__tag--green"
                          : tour.category === "ECONOMY"
                            ? "tour-list-card__tag--gray"
                            : ""
                    }`}
                  >
                    <StarOutlined /> Hạng: {tour.category}
                  </span>
                )}
              </div>

              <div className="tour-list-card__details">
                <div className="tour-list-card__detail-item">
                  <EnvironmentOutlined className="icon-blue" />
                  <strong>Lịch trình:</strong> {tour.departurePlace} ➔{" "}
                  {tour.destination}
                </div>
                <div className="tour-list-card__detail-item">
                  <CalendarOutlined className="icon-orange" />
                  <strong>Thời gian:</strong>{" "}
                  {new Date(tour.startDate).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(tour.endDate).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>

            {/* Cột phải: Giá và hành động */}
            <div className="tour-list-card__action-col">
              <div className="tour-list-card__progress-wrapper">
                <div className="tour-list-card__progress-text">
                  <span>
                    Đã đặt <strong>{tour.bookedPercentage}%</strong>
                  </span>
                  <span className="highlight">
                    Còn {tour.availableSeats} chỗ
                  </span>
                </div>
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
              </div>

              <div className="tour-list-card__price-wrapper">
                <span className="tour-list-card__price-label">
                  Giá trọn gói từ:
                </span>
                <div className="tour-list-card__price">
                  {Number(tour.price).toLocaleString("vi-VN")} <span>đ</span>
                </div>
              </div>

              <button className="tour-list-card__btn">Xem chi tiết</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
