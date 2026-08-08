import React from "react";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  CarOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { IMAGE_URLS } from "../../../constants/api";
import { formatDate, formatPrice } from "../../../helpers/format/format";
import fallbackImage from "../../../assets/images/fallbackImage.jpg";
import "./TourList.scss";

export default function TourList({ data }) {
  const navigate = useNavigate();
  const { t } = useTranslation("tours");
  const urlImage = IMAGE_URLS.TOURS;

  const getCategoryKey = (category) => {
    const cat = category;
    // chữ cái đầu viết hoa, toàn bộ chữ sau viết thường
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

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
                  ? t("status.full")
                  : tour.isAvailable
                    ? t("status.available")
                    : t("status.closed")}
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
                      ? t("filter.transBus")
                      : tour.transport === "AIRPLANE"
                        ? t("filter.transFlight")
                        : t("filter.transMotorbike")}
                  </span>
                )}
                {tour.category && (
                  <span
                    className={`tour-list-card__tag cat-${(tour.category || "Standard").toLowerCase()}`}
                  >
                    <StarOutlined /> {t("card.class")}{" "}
                    {t(`filter.cat${getCategoryKey(tour.category)}`)}
                  </span>
                )}
              </div>

              <div className="tour-list-card__details">
                <div className="tour-list-card__detail-item">
                  <EnvironmentOutlined className="icon-blue" />
                  <strong>{t("card.itinerary")}</strong> {tour.departurePlace} ➔{" "}
                  {tour.destination}
                </div>
                <div className="tour-list-card__detail-item">
                  <CalendarOutlined className="icon-orange" />
                  <strong>{t("card.duration")}</strong>{" "}
                  {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                </div>
              </div>
            </div>

            {/* Cột phải: Giá và hành động */}
            <div className="tour-list-card__action-col">
              <div className="tour-list-card__progress-wrapper">
                <div className="tour-list-card__progress-text">
                  <span>
                    {t("card.booked", { percent: tour.bookedPercentage })}
                  </span>
                  <span className="highlight">
                    {t("card.seatsLeft", { count: tour.availableSeats })}
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
                  {t("card.pricePackageFrom")}
                </span>
                <div className="tour-list-card__price">
                  {formatPrice(tour.price)}
                </div>
              </div>

              <button className="tour-list-card__btn">
                {t("card.viewDetail")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
