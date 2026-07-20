import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import { IMAGE_URLS } from "../../../constants/api";
import "./About.scss";

import fallbackImg from "../../../images/carousel-1.jpg";
import { useAboutAnimation } from "./useAboutAnimation";

const { Title, Paragraph } = Typography;

function About() {
  const context = useOutletContext();
  const containerRef = useRef(null);
  const [currentImg, setCurrentImg] = useState(fallbackImg);

  // Gọi file hiệu ứng GSAP
  useAboutAnimation(containerRef);

  useEffect(() => {
    // Chúng ta dùng biến 'data' ở đây rồi
    const data = context?.carouselData;

    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const apiImageName = data[randomIndex]?.image;
      if (apiImageName) {
        setCurrentImg(`${IMAGE_URLS.HERO_CAROUSEL}${apiImageName.trim()}`);
      }
    }
  }, [context?.carouselData]);

  const features = [
    "First Class Flights",
    "Handpicked Hotels",
    "5 Star Accommodations",
    "Latest Model Vehicles",
    "150 Premium City Tours",
    "24/7 Service",
  ];

  return (
    <section className="about" ref={containerRef}>
      <div className="about__container">
        <Row gutter={[40, 40]} align="middle">
          <Col xs={24} lg={11}>
            <div className="about__gallery">
              <img
                src={currentImg}
                className="about__image"
                alt="About Travela"
              />
              <div className="about__experience-badge">
                <span className="about__experience-years">10+</span>
                <span className="about__experience-text">
                  Years
                  <br />
                  Experience
                </span>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={13}>
            <div className="about__content">
              <h5 className="about__subtitle">About Us</h5>
              <Title level={1} className="about__title">
                Welcome to&nbsp;
                <span className="about__highlight">TravelAway</span>
              </Title>

              <Paragraph className="about__description">
                Discover the world with us! We provide top-notch travel
                experiences tailored just for you. From breathtaking natural
                wonders to vibrant cityscapes, every journey is a story waiting
                to be told.
              </Paragraph>

              <Paragraph className="about__description">
                Our dedicated team of travel experts is committed to ensuring
                your trip is seamless, enjoyable, and unforgettable. Let us
                handle the details while you focus on making memories.
              </Paragraph>

              <Row className="about__features" gutter={[16, 16]}>
                {features.map((feature, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <div className="about__feature-item">
                      <span className="about__feature-icon">
                        <ArrowRightOutlined />
                      </span>
                      <span className="about__feature-text">{feature}</span>
                    </div>
                  </Col>
                ))}
              </Row>

              <Button type="primary" className="about__action">
                Read More
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default About;
