import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Card, Progress } from "antd";
import "swiper/css";
import "./RelatedTours.scss";
// Tái sử dụng style của TourCard
import "../../../components/Client/TourListResults/TourCard.scss";

import { getToursUser } from "../../../services/tour";
import { IMAGE_URLS } from "../../../constants/api";
import BG from "../../../images/carousel-1.jpg";

const RelatedTours = () => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();
  const fallbackImage = BG;
  const urlImage = IMAGE_URLS.TOURS;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await getToursUser();
        if (res?.success) {
          const list = Array.isArray(res.data) 
            ? res.data 
            : (res.data?.items || res.data?.tours || []);
          setTours(list.slice(0, 8)); 
        }
      } catch (err) {
        console.error("Lỗi lấy tour liên quan:", err);
      }
    };
    fetchTours();
  }, []);

  if (!tours || tours.length === 0) return null;

  return (
    <div className="related-tours-section">
      <h2 className="section-title">Tour Tương Tự</h2>
      <div className="related-carousel">
        <Swiper
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            576: { slidesPerView: 2.2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
          }}
        >
          {tours.map((tour) => {
            const totalSeats = tour.quantity || 30;
            const soldSeats = tour.sold || 0;
            const availableSeats = totalSeats - soldSeats;
            const percentSold = Math.round((soldSeats / totalSeats) * 100);

            return (
              <SwiperSlide key={tour.id || tour._id}>
                <Card
                  hoverable
                  className="tour-card"
                  onClick={() => navigate(`/tours/${tour.slug}`)}
                  style={{ height: "100%", display: "flex", flexDirection: "column" }}
                  styles={{ body: { display: "flex", flexDirection: "column", flexGrow: 1 } }}
                >
                  <div className="tour-card__hero">
                    {/* Badge trạng thái */}
                    <span className={`tour-card__status-badge ${tour.status !== "ACTIVE" ? "status-inactive" : availableSeats <= 0 ? "status-full" : "status-available"}`}>
                      {tour.status !== "ACTIVE" ? "Tạm ngưng" : availableSeats <= 0 ? "Hết chỗ" : "Còn chỗ"}
                    </span>

                    <img
                      src={tour.thumbnail ? (urlImage + tour.thumbnail) : fallbackImage}
                      alt={tour.name}
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
                        : tour.departurePlace || "TP. HCM"}
                    </span>

                    <div className="tour-card__score-bar">
                      <span>📍 Điểm đến: {tour.destination || "..."}</span>
                      <span>Còn {availableSeats} chỗ</span>
                    </div>
                  </div>

                  <div className="tour-card__body" style={{ flexGrow: 1 }}>
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
                        {tour.startDate ? new Date(tour.startDate).toLocaleDateString("vi-VN") : "Đang cập nhật"}
                      </span>
                    </div>

                    <div className="tour-card__footer" style={{ marginTop: "auto" }}>
                      <div className="tour-card__price-section">
                        <span className="tour-card__price-label">
                          Giá trọn gói từ:
                        </span>
                        <span className="tour-card__price-value">
                          {Number(tour.price || 0).toLocaleString("vi-VN")}
                          <span className="tour-card__price-unit">đ</span>
                        </span>
                      </div>
                      <span className="tour-card__more-badge">Chi tiết</span>
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
