import { Col, Row } from "antd";
import { UserOutlined, FlagOutlined, PictureOutlined } from "@ant-design/icons";

function SummaryCards({ totalUsers = 0, totalTours = 0, totalCarousels = 0 }) {
  const cards = [
    {
      title: "Tổng số Users",
      value: totalUsers,
      icon: <UserOutlined />,
      bgColor: "rgba(13, 110, 253, 0.1)",
      color: "var(--primary-color)",
    },
    {
      title: "Tổng số Tours",
      value: totalTours,
      icon: <FlagOutlined />,
      bgColor: "rgba(82, 196, 26, 0.1)",
      color: "var(--status-available-bg)",
    },
    {
      title: "Tổng số Banners",
      value: totalCarousels,
      icon: <PictureOutlined />,
      bgColor: "rgba(250, 140, 22, 0.1)",
      color: "var(--color-orange)",
    },
  ];

  return (
    <Row gutter={[24, 24]} className="dashboard__cards">
      {cards.map((card, index) => (
        <Col xs={24} sm={8} lg={8} key={index}>
          <div className="dashboard__card">
            <div
              className="dashboard__card-icon"
              style={{
                backgroundColor: card.bgColor,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
            <div className="dashboard__card-content">
              <div className="dashboard__card-title">{card.title}</div>
              <div className="dashboard__card-value">{card.value}</div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default SummaryCards;
