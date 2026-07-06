import { Button, Carousel } from "antd";
import { useOutletContext } from "react-router-dom";
import { IMAGE_URLS } from "../../../constants/api";

function HeroCarousel() {
  const { carouselData } = useOutletContext();

  const activeCarousels =
    carouselData?.filter((slide) => slide.isActive === true) || [];
  //filter lọc trả về tất cả phần tử slide active = true

  if (activeCarousels.length === 0) {
    return <div style={{ height: "450px", background: "#eaeaea" }} />;
  }

  const urlImage = IMAGE_URLS.HERO_CAROUSEL;

  return (
    <div className="home">
      <div className="hero-carousel">
        <Carousel arrows autoplay speed={600}>
          {activeCarousels.map((slide) => (
            <div key={slide.id || slide._id} className="hero-carousel__item">
              <div
                className="hero-carousel__bg"
                style={{
                  backgroundImage: `url(${urlImage + slide.image.trim()})`,
                }}
              />
              <div className="hero-carousel__overlay">
                <div className="hero-carousel__caption">
                  <h4 className="hero-carousel__subtitle">
                    {slide.subtitle || "Explore The World"}
                  </h4>
                  <h1 className="hero-carousel__title">{slide.title}</h1>
                  <p className="hero-carousel__desc">{slide.description}</p>
                  <Button
                    type="primary"
                    size="large"
                    className="hero-carousel__btn"
                  >
                    Discover Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default HeroCarousel;
