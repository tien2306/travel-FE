import { Button, Carousel } from "antd";
import "./home.scss";

import carousel1 from "../../images/carousel-1.jpg";
import carousel2 from "../../images/carousel-2.jpg";
import carousel3 from "../../images/carousel-3.jpg";

function Home() {
  const slides = [
    {
      id: 1,
      image: carousel1,
      subtitle: "Explore The World",
      title: "Let's The World Together!",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      id: 2,
      image: carousel2,
      subtitle: "Explore The World",
      title: "Find Your Perfect Tour At Travel",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      id: 3,
      image: carousel3,
      subtitle: "Explore The World",
      title: "You Like To Go?",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
  ];

  return (
    <div className="home-content">
      <div className="hero-carousel">
        <Carousel arrows autoplay speed="600">
          {slides.map((slide) => (
            <div key={slide.id} className="hero-carousel__item">
              {/* Thẻ chứa ảnh nền */}
              <div
                className="hero-carousel__bg"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Lớp phủ đen mờ và nội dung text đè lên trên */}
              <div className="hero-carousel__overlay">
                <div className="hero-carousel__caption">
                  <h4 className="hero-carousel__subtitle">{slide.subtitle}</h4>
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

      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>
      <div>page home</div>

      {/* Các phần tiếp theo của trang như About, Services sẽ viết ở dưới này */}
    </div>
  );
}

export default Home;
