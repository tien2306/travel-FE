import React from "react";
import { Row, Col, Card, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import fallbackImage from "../../../assets/images/fallbackImage.jpg";
import { formatDate, formatPrice } from "../../../helpers/format/format";
import { IMAGE_URLS } from "../../../constants/api";
import "./TourGrid.scss";

export default function TourGrid({ data }) {
  console.log("DEBUG TOUR GRID DATA:", data);
  const navigate = useNavigate();
  const { t } = useTranslation("tours");
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
          <Col key={tour.id || tour._id} xs={24} sm={12} md={12} lg={12} xl={8}>
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

                <div
                  className={`tour-card__badge-category cat-${(tour.category || "Standard").toLowerCase()}`}
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

                {/* --- Lộ trình vắt ngang ảnh --- */}
                <div className="tour-card__badges-overlay">
                  <div className="tour-card__badge-route">
                    <span title={tour.departurePlace}>
                      {tour.departurePlace?.toLowerCase() ===
                        "ho chi minh city" ||
                      tour.departurePlace?.toLowerCase() === "hcm"
                        ? t("filter.destHcm")
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

                  {/* --- Thanh tiến trình đặt chỗ --- */}
                  <div className="tour-card__progress-block">
                    <Progress
                      percent={(() => {
                        const sold = tour.sold || 0;
                        const available = tour.availableSeats || 0;
                        const total = tour.quantity || available + sold || 0;
                        return total > 0
                          ? sold > 0
                            ? Math.ceil((sold / total) * 100)
                            : 0
                          : 0;
                      })()}
                      size="small"
                      status="active"
                      showInfo={false}
                      strokeColor={(() => {
                        const sold = tour.sold || 0;
                        const available = tour.availableSeats || 0;
                        const total = tour.quantity || available + sold || 0;
                        return (total > 0 ? (sold / total) * 100 : 0) > 74
                          ? { "0%": "#fa8c16", "100%": "#ff4d4f" }
                          : { "0%": "#108ee9", "100%": "#87d068" };
                      })()}
                    />

                    {/* Tổng phần trăm đã đặt */}
                    <span className="tour-card__progress-text">
                      {t("card.booked", {
                        percent: (() => {
                          const sold = tour.sold || 0;
                          const available = tour.availableSeats || 0;
                          const total = tour.quantity || available + sold || 0;
                          return total > 0
                            ? sold > 0
                              ? Math.ceil((sold / total) * 100)
                              : 0
                            : 0;
                        })(),
                      })}
                    </span>
                  </div>

                  {/* Đã gỡ phần mô tả ngắn theo yêu cầu để giảm chiều cao thẻ */}

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

                  <div className="tour-card__footer">
                    <div className="tour-card__price-section">
                      <span className="tour-card__price-label">
                        {t("card.priceFrom")}
                      </span>
                      <span className="tour-card__price-value">
                        {formatPrice(tour.price)}
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
