import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Card } from "antd";
import "swiper/css";
import "./ToursRelated.scss";
// Tái sử dụng style của TourCard
import "../../../components/Client/ToursAll/TourCard.scss";

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
            : res.data?.items || res.data?.tours || [];
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
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
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
                  className="related-tour-card"
                  onClick={() => navigate(`/tours/${tour.slug}`)}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  styles={{
                    body: {
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      padding: 0,
                    },
                  }}
                >
                  <div className="related-tour-card__hero">
                    <span
                      className={`status-badge ${tour.status !== "ACTIVE" ? "inactive" : availableSeats <= 0 ? "full" : "available"}`}
                    >
                      {tour.status !== "ACTIVE"
                        ? "Tạm ngưng"
                        : availableSeats <= 0
                          ? "Hết chỗ"
                          : "Còn chỗ"}
                    </span>

                    <img
                      src={
                        tour.thumbnail
                          ? urlImage + tour.thumbnail
                          : fallbackImage
                      }
                      alt={tour.name}
                      className="hero-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                  </div>

                  <div className="related-tour-card__body">
                    <h3 className="title">{tour.name}</h3>

                    <div className="info-row">
                      <span className="label">📍 Hành trình:</span>
                      <span
                        className="value"
                        title={`${tour.departurePlace === "Ho Chi Minh City" ? "TP. HCM" : tour.departurePlace || "TP. HCM"} -> ${tour.destination || "Đang cập nhật"}`}
                      >
                        {tour.departurePlace === "Ho Chi Minh City"
                          ? "TP. HCM"
                          : tour.departurePlace || "TP. HCM"}
                        {" ➔ "}
                        {tour.destination || "Đang cập nhật"}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">📅 Khởi hành:</span>
                      <span className="value">
                        {tour.startDate
                          ? new Date(tour.startDate).toLocaleDateString("vi-VN")
                          : "Đang cập nhật"}
                      </span>
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
