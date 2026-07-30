import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Card } from "antd";
import "swiper/css";
import "./ToursRelated.scss";
// Tái sử dụng style của TourCard
import "../../../components/Client/ToursAll/TourCard.scss";
import { useTranslation } from "react-i18next";

import { getToursUser } from "../../../services/tour";
import { IMAGE_URLS } from "../../../constants/api";
import BG from "../../../images/carousel-1.jpg";
import { formatPrice, formatDate } from "../../../helpers/formatDate";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
const RelatedTours = ({ currentTour }) => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation("tours");
  const fallbackImage = BG;
  const urlImage = IMAGE_URLS.TOURS;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await getToursUser();
        if (res?.success) {
          let list = Array.isArray(res.data)
            ? res.data
            : res.data?.items || res.data?.tours || [];

          if (currentTour) {
            // Bỏ qua tour hiện tại đang xem
            list = list.filter((t) => t.id !== currentTour.id);

            // Tính điểm tương đồng
            list.forEach((t) => {
              let score = 0;
              // 1. Cùng điểm đến (+3 điểm)
              if (
                t.destination &&
                currentTour.destination &&
                t.destination === currentTour.destination
              ) {
                score += 3;
              }
              // 2. Cùng danh mục (+2 điểm)
              if (
                t.category &&
                currentTour.category &&
                t.category === currentTour.category
              ) {
                score += 2;
              }
              // 3. Cùng khoảng giá (chênh lệch <= 20%) (+1 điểm)
              if (t.price && currentTour.price) {
                const diff = Math.abs(t.price - currentTour.price);
                if (diff / currentTour.price <= 0.2) {
                  score += 1;
                }
              }
              t._similarityScore = score;
            });

            // Sắp xếp theo độ tương đồng giảm dần
            list.sort(
              (a, b) => (b._similarityScore || 0) - (a._similarityScore || 0),
            );
          }

          // Lấy top 10 tour tương tự nhất
          setTours(list.slice(0, 10));
        }
      } catch (err) {
        console.error("Lỗi lấy tour liên quan:", err);
      }
    };

    fetchTours();
  }, [currentTour]); // Cập nhật khi currentTour thay đổi

  if (!tours || tours.length === 0) return null;

  return (
    <div className="related-tours-section">
      <h2 className="section-title">{t("related.title")}</h2>
      <div className="related-carousel">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            576: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {tours.map((tour) => {
            return (
              <SwiperSlide key={tour.id || tour._id}>
                <Card
                  hoverable
                  className="related-tour-card-new"
                  onClick={() => navigate(`/tours/${tour.slug}`)}
                  styles={{
                    body: {
                      display: "flex",
                      flexDirection: "column",
                      padding: 0,
                      height: "100%",
                    },
                  }}
                >
                  <div className="tour-hero">
                    <img
                      src={
                        tour.thumbnail
                          ? urlImage + tour.thumbnail
                          : fallbackImage
                      }
                      alt={tour.name}
                      className="tour-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div className="tour-badge-bottom">
                      {t("related.from")}{" "}
                      {tour.departurePlace === "Ho Chi Minh City" ||
                      tour.departurePlace === "HCM"
                        ? "Hồ Chí Minh"
                        : tour.departurePlace || "Hồ Chí Minh"}
                    </div>

                    {/* Lớp phủ khi hover */}
                    <div className="tour-overlay">
                      <div className="overlay-content">
                        <p className="overlay-desc">
                          {tour.shortDesc || tour.name}
                        </p>
                        <p className="overlay-detail">
                          {t("related.itinerary")}{" "}
                          {tour.duration || "5 ngày 4 đêm"}
                        </p>
                        <p className="overlay-detail">
                          {t("related.departure")}{" "}
                          {tour.startDate
                            ? formatDate(tour.startDate)
                            : "01/01/2026"}
                        </p>
                        <p className="overlay-detail">
                          {t("related.transport")} {tour.transport || "Xe"}
                        </p>
                      </div>
                      <span className="overlay-more">
                        {t("related.viewMore")}
                      </span>
                    </div>
                  </div>

                  <div className="tour-title-box">
                    <h3 className="title">{tour.name}</h3>
                  </div>

                  <div className="tour-info-box">
                    <div className="info-left">
                      <div className="info-item">
                        <ClockCircleOutlined className="icon" />{" "}
                        {tour.duration || "5 ngày 4 đêm"}
                      </div>
                      <div className="info-item">
                        <CalendarOutlined className="icon" />{" "}
                        {tour.startDate
                          ? formatDate(tour.startDate)
                          : "01/01/2026"}
                      </div>
                    </div>
                    <div className="info-right">
                      <span className="price">{formatPrice(tour.price)}</span>
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedTours;
