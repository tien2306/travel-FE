import { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Keyboard } from "swiper/modules";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMAGE_URLS } from "../../../constants/api";

import "swiper/css";
import "swiper/css/effect-fade";
import "./HeroCarousel.scss";

function HeroCarousel() {
  const { carouselData } = useOutletContext();
  const navigate = useNavigate();
  // chuyển đến slide tiếp theo
  const swiperRef = useRef(null);
  const { t } = useTranslation("home");

  //Logic xử lí cái thanh trượt bên dưới số hiển thị
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeCarousels =
    carouselData?.filter((slide) => slide.isActive === true) || [];

  const total = activeCarousels.length;

  const onAutoplayTimeLeft = useCallback((_s, _time, prog) => {
    setProgress(1 - prog);
  }, []);

  const onSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
    setProgress(0);
  }, []);

  if (total === 0) {
    return <div className="hero-carousel hero-carousel--empty" />;
  }

  const urlImage = IMAGE_URLS.HERO_CAROUSEL;
  const pad = (n) => String(n + 1).padStart(2, "0");
  // End Logic xử lí cái thanh trượt bên dưới số hiển thị

  return (
    <div className="hero-carousel">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, EffectFade, Keyboard]}
        effect="fade"
        loop
        speed={900}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        grabCursor
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        onSlideChange={onSlideChange}
        className="hero-swiper"
      >
        {activeCarousels.map((slide) => (
          <SwiperSlide key={slide.id || slide._id}>
            {/* Ảnh nền + ken burns */}
            <div
              className="hero-slide__bg"
              style={{
                backgroundImage: `url(${urlImage + slide.image.trim()})`,
              }}
            />
            {/* Overlay gradient */}
            <div className="hero-slide__overlay" />

            {/* Caption */}
            <div className="hero-slide__content">
              <div className="hero-slide__caption">
                <span className="hero-slide__tag">
                  {slide.subtitle || t("hero.defaultTag")}
                </span>
                <h1 className="hero-slide__title">{slide.title}</h1>
                {slide.description && (
                  <p className="hero-slide__desc">{slide.description}</p>
                )}
                <div className="hero-slide__actions">
                  <button
                    className="hero-slide__btn hero-slide__btn--primary"
                    onClick={() => {
                      // Tìm phần tử danh sách tour bằng class của nó
                      const tourSection =
                        document.querySelector(".tour-results");

                      if (tourSection) {
                        // Nếu tìm thấy, cuộn mượt mà xuống vị trí đó
                        tourSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      } else {
                        // Nếu không tìm thấy (ví dụ đứng ở trang khác), thì mới chuyển hướng về trang tours
                        navigate("/tours");
                      }
                    }}
                  >
                    {t("hero.exploreBtn")}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    className="hero-slide__btn hero-slide__btn--outline"
                    onClick={() => navigate("/contact")}
                  >
                    {t("hero.contactBtn")}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ---- Controls bar ---- */}
      <div className="hero-controls">
        {/* Counter kiểu editorial */}
        <div className="hero-controls__counter">
          <span className="hero-controls__current">{pad(activeIndex)}</span>
          <span className="hero-controls__sep" />
          <span className="hero-controls__total">{pad(total - 1)}</span>
        </div>

        {/* Progress bar ticks */}
        <div className="hero-controls__ticks">
          {activeCarousels.map((_, i) => (
            <button
              key={i}
              className={`hero-controls__tick${i === activeIndex ? " is-active" : ""}`}
              onClick={() => swiperRef.current?.swiper.slideToLoop(i)}
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className="hero-controls__tick-fill"
                style={{
                  transform:
                    i === activeIndex
                      ? `scaleX(${progress})`
                      : i < activeIndex
                        ? "scaleX(1)"
                        : "scaleX(0)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Nút prev / next text */}
        <div className="hero-controls__nav">
          <button
            className="hero-controls__nav-btn"
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            aria-label="Slide trước"
          >
            ←
          </button>
          <button
            className="hero-controls__nav-btn"
            onClick={() => swiperRef.current?.swiper.slideNext()}
            aria-label="Slide tiếp"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;
