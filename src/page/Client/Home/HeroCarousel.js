import { Button, Carousel } from "antd";
import { useOutletContext } from "react-router-dom";

function HeroCarousel() {
  const { carouselData } = useOutletContext();
  if (!carouselData || carouselData.length === 0) {
    return <div style={{ height: "450px", background: "#eaeaea" }} />;
  }

  return (
    <div className="home">
      <div className="hero-carousel">
        <Carousel arrows autoplay speed="600">
          {carouselData?.map((slide) => (
            <div key={slide.id || slide._id} className="hero-carousel__item">
              <div
                className="hero-carousel__bg"
                style={{ backgroundImage: `url(${slide.image})` }}
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
