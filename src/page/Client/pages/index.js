import React from "react";
import { Row, Col } from "antd";
import {
  TeamOutlined,
  CommentOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Pages.scss";

function Pages() {
  const navigate = useNavigate();

  const pagesList = [
    {
      title: "Đội ngũ (Our Team)",
      desc: "Làm quen với những thành viên đã tạo nên TravelAway, câu chuyện và nỗ lực không ngừng nghỉ của chúng tôi.",
      icon: <TeamOutlined />,
      link: "/pages/team",
    },
    {
      title: "Cảm nhận (Testimonial)",
      desc: "Lắng nghe những đánh giá và trải nghiệm thực tế từ các khách hàng đã đồng hành cùng TravelAway.",
      icon: <CommentOutlined />,
      link: "/pages/testimonial",
    },
    {
      title: "Dịch vụ (Services)",
      desc: "Khám phá các dịch vụ du lịch đa dạng, đặt tour toàn cầu, khách sạn và hướng dẫn viên chuyên nghiệp.",
      icon: <AppstoreOutlined />,
      link: "/services",
    },
    {
      title: "Về chúng tôi (About)",
      desc: "Tìm hiểu thêm về tầm nhìn, sứ mệnh và giá trị cốt lõi mà TravelAway mang lại cho cộng đồng.",
      icon: <InfoCircleOutlined />,
      link: "/about",
    },
    {
      title: "Liên hệ (Contact)",
      desc: "Mọi thắc mắc và yêu cầu hỗ trợ, đừng ngần ngại liên lạc với đội ngũ chăm sóc khách hàng 24/7.",
      icon: <ContactsOutlined />,
      link: "/contact",
    },
    {
      title: "Hỏi đáp (FAQ)",
      desc: "Giải đáp nhanh chóng các câu hỏi thường gặp về quy trình đặt tour, thanh toán và các chính sách.",
      icon: <QuestionCircleOutlined />,
      link: "/faq",
    },
  ];

  return (
    <section className="pages-index">
      <div className="pages-index__container">
        <div className="pages-index__header">
          <div className="subtitle-wrapper">
            <span className="line"></span>
            <span className="subtitle">EXPLORE PAGES</span>
            <span className="line"></span>
          </div>
          <h2 className="title">Các Trang Tiện Ích</h2>
        </div>

        <Row gutter={[24, 24]} className="pages-index__grid">
          {pagesList.map((item, index) => {
            // Xác định xem card này nằm ở cột TRÁI hay cột PHẢI (nếu layout 2 cột trên PC)
            const isLeftColumn = index % 2 === 0;

            return (
              <Col xs={24} lg={12} key={index}>
                <div
                  className={`page-card ${isLeftColumn ? "page-card--left" : "page-card--right"}`}
                  onClick={() => navigate(item.link)}
                >
                  <div className="page-card__content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-desc">{item.desc}</p>
                  </div>
                  <div className="page-card__icon">{item.icon}</div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
}

export default Pages;
