import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "antd";

// Import Swiper styles
import "swiper/css";
import "./ProductGallery.scss";

const ProductGallery = ({ images, tourName }) => {
  const [mainImg, setMainImg] = useState(
    images && images.length > 0 ? images[0] : "",
  );

  if (!images || images.length === 0) return null;

  return (
    <div className="product-gallery">
      {/* Ảnh chính to */}
      <div className="main-image-box">
        <Image src={mainImg} alt={tourName} className="main-image" />
      </div>

      {/* Lưới ảnh nhỏ ở dưới (Dạng Carousel dùng Swiper) */}
      <div className="thumbnail-carousel">
        <Swiper
          spaceBetween={10}
          slidesPerView={4}
          breakpoints={{
            // Responsive
            320: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
          }}
          className="thumbnail-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={`thumbnail-item ${img === mainImg ? "active" : ""}`}
                onClick={() => setMainImg(img)}
              >
                <img src={img} alt={`${tourName} thumb ${idx}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductGallery;
