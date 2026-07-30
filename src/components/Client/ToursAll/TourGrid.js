import React from "react";
import { Row, Col, Card, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import BG from "../../../images/carousel-1.jpg";
import { IMAGE_URLS } from "../../../constants/api";
import { formatDate } from "../../../helpers/formatDate";

export default function TourGrid({ data }) {
  const navigate = useNavigate();
  const { t } = useTranslation("tours");

  // Tạo chuỗi ảnh SVG mặc định an toàn để thay thế khi ảnh API bị trống hoặc lỗi tải
  const fallbackImage = BG;
  const urlImage = IMAGE_URLS.TOURS;

  const getCategoryKey = (category) => {
    const cat = category;
    // chữ cái đầu viết hoa, toàn bộ chữ sau viết thường
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

  return (
    <Row
      gutter={[
        { xs: 12, sm: 16, md: 24, lg: 24 },
        { xs: 16, sm: 20, md: 24, lg: 24 },
      ]}
    >
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
                    ? t("status.full")
                    : tour.isAvailable
                      ? t("status.available")
                      : t("status.closed")}
                </span>

                {/* --- [CHỈ PC] Badge Danh mục (Góc phải ảnh) --- */}
                <div
                  className={`tour-card__badge-category desktop-only cat-${(tour.category || "Standard").toLowerCase()}`}
                >
                  <StarFilled />
                  <span>{t(`filter.cat${getCategoryKey(tour.category)}`)}</span>
                </div>

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

                {/* --- [CHỈ PC] Lộ trình vắt ngang ảnh --- */}
                <div className="tour-card__badges-overlay desktop-only">
                  <div className="tour-card__badge-route">
                    <span title={tour.departurePlace}>
                      {tour.departurePlace?.toLowerCase() ===
                        "ho chi minh city" ||
                      tour.departurePlace?.toLowerCase() === "hcm"
                        ? "TP. HCM"
                        : tour.departurePlace}
                    </span>
                    <span className="route-divider">➔</span>
                    <span
                      className="route-destination"
                      title={tour.destination}
                    >
                      {tour.destination}
                    </span>
                  </div>
                </div>
              </div>

              <div className="tour-card__body">
                <div className="tour-card__floating-content">
                  {/* Title */}
                  <h3 className="tour-card__title" title={tour.name}>
                    {tour.name}
                  </h3>

                  {/* --- [CHỈ PC] Thanh tiến trình đặt chỗ --- */}
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
                      {t("card.booked", { percent: tour.bookedPercentage })}
                    </span>
                  </div>

                  {/* --- [CHUNG] Mô tả ngắn gọn --- */}
                  <p className="tour-card__short-desc">
                    {tour.shortDesc ||
                      "Trải nghiệm chuyến du lịch tuyệt vời cùng gia đình và người thân."}
                  </p>

                  {/* --- [CHUNG] Lịch khởi hành --- */}
                  <div className="tour-card__date-block">
                    <div className="tour-card__date-info">
                      <span className="tour-card__icon">📅</span>
                      <span className="tour-card__date-label">
                        {t("card.departureDate")}
                      </span>
                      <span className="tour-card__date-badge-accent">
                        {" "}
                        {formatDate(tour.startDate)}
                      </span>
                    </div>
                  </div>

                  {/* --- [CHỈ MOBILE] Lộ trình dạng văn bản --- */}
                  <div className="tour-card__route-mobile">
                    <div className="tour-card__route-info">
                      <span className="tour-card__icon">📍</span>
                      <span className="tour-card__route-label">
                        {t("card.itinerary")}
                      </span>
                      <span
                        className="tour-card__route-value"
                        title={`${tour.departurePlace} ➔ ${tour.destination}`}
                      >
                        {tour.departurePlace} ➔ {tour.destination}
                      </span>
                    </div>
                  </div>

                  <div className="tour-card__footer">
                    <div className="tour-card__price-section">
                      <span className="tour-card__price-label">
                        {t("card.priceFrom")}
                      </span>
                      <span className="tour-card__price-value">
                        {Number(tour.price).toLocaleString("vi-VN")}
                        <span className="tour-card__price-unit">đ</span>
                      </span>
                    </div>
                    <span className="tour-card__more-badge">
                      {t("card.viewDetail")}
                    </span>
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
