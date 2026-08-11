import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAboutAnimation } from "./animations";
import "./About.scss";
import { getRandomBannerImage } from "../../../helpers/ui/banner";

const fallbackImg = "/images/fallbackImage.jpg";

const { Paragraph } = Typography;

function About() {
  const context = useOutletContext();
  const containerRef = useRef(null);
  const [currentImg, setCurrentImg] = useState(fallbackImg);
  const { t } = useTranslation("about");

  // Gọi file hiệu ứng GSAP
  useAboutAnimation(containerRef);

  useEffect(() => {
    setCurrentImg(getRandomBannerImage(context?.carouselData));
  }, [context?.carouselData]);

  const features = [
    t("features.f1"),
    t("features.f2"),
    t("features.f3"),
    t("features.f4"),
    t("features.f5"),
    t("features.f6"),
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
                  {t("years")}
                  <br />
                  {t("experience")}
                </span>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={13}>
            <div className="about__content">
              <h5 className="about__subtitle">{t("subtitle")}</h5>
              <h1 className="about__title">
                {t("title")}&nbsp;
                <span className="about__highlight">TravelAway</span>
              </h1>

              <Paragraph className="about__description">{t("desc1")}</Paragraph>

              <Paragraph className="about__description">{t("desc2")}</Paragraph>

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
                {t("readMore")}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default About;
