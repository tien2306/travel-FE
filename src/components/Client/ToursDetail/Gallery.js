import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Image } from "antd";
import {
  ArrowsAltOutlined,
  CaretRightFilled,
  CaretLeftFilled,
} from "@ant-design/icons";
import "swiper/css";
import "./Gallery.scss";

const FALLBACK_IMG = "/images/fallbackImage.jpg";

const ProductGallery = ({ thumbnail, images, tourName, urlImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperInstance && swiperInstance.slideTo) {
      swiperInstance.slideTo(currentIndex);
    }
  }, [currentIndex, swiperInstance]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [thumbnail, images]);

  const mainImgUrl = images[currentIndex]
    ? urlImage + images[currentIndex]
    : FALLBACK_IMG;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image
          src={mainImgUrl}
          alt={tourName}
          className="product-gallery__main-img"
          fallback={FALLBACK_IMG}
        />

        {/* Nút Phóng to ở góc phải trên */}
        <div className="product-gallery__zoom-icon">
          <ArrowsAltOutlined />
        </div>

        {/* Nút điều hướng (Chỉ hiện khi có nhiều hơn 1 ảnh) */}
        {images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <div
                className="product-gallery__nav product-gallery__nav--prev"
                onClick={handlePrev}
              >
                <CaretLeftFilled />
              </div>
            )}
            {currentIndex < images.length - 1 && (
              <div
                className="product-gallery__nav product-gallery__nav--next"
                onClick={handleNext}
              >
                <CaretRightFilled />
              </div>
            )}
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="product-gallery__thumbs">
          <Swiper
            onSwiper={setSwiperInstance}
            spaceBetween={8}
            slidesPerView={4}
            breakpoints={{
              320: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
            className="product-gallery__swiper"
          >
            {images.map((img, idx) => {
              const thumbUrl = img ? urlImage + img : FALLBACK_IMG;
              return (
                <SwiperSlide key={idx}>
                  <div
                    className={`product-gallery__thumb ${
                      currentIndex === idx
                        ? "product-gallery__thumb--active"
                        : ""
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    <img
                      src={thumbUrl}
                      alt={`${tourName} ${idx + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
