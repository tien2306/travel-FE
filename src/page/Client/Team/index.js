import React from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import {
  GithubOutlined,
  CodeOutlined,
  DatabaseOutlined,
  HeartFilled,
} from "@ant-design/icons";
import "./Team.scss";

const { Title, Paragraph } = Typography;

function Team() {
  const teamMembers = [
    {
      name: "Phan Thanh Tiến",
      role: "Frontend Developer",
      github: "https://github.com/tien2306",
      avatar: "https://avatars.githubusercontent.com/tien2306",
      description:
        "Đảm nhiệm việc xây dựng  giao diện người dùng, tối ưu hóa trải nghiệm (UI/UX) và tương tác hệ thống client-side.",
      icon: <CodeOutlined />,
    },
    {
      name: "Nguyễn Dương Hoàng Huy",
      role: "Backend Developer",
      github: "https://github.com/HuyNguyeen22303",
      avatar: "https://avatars.githubusercontent.com/HuyNguyeen22303",
      description:
        "Thiết kế kiến trúc cơ sở dữ liệu, xây dựng API và xử lý logic nghiệp vụ, đảm bảo hệ thống bảo mật và vận hành mượt mà.",
      icon: <DatabaseOutlined />,
    },
  ];

  return (
    <section className="team-page">
      <div className="team-page__container">
        {/* Our Story Section */}
        <div className="team-page__story">
          <div className="story-header">
            <Title level={2} className="story-title">
              Hành trình tạo nên <span className="highlight">TravelAway</span>
            </Title>
            <div className="story-divider">
              <HeartFilled className="heart-icon" />
            </div>
          </div>

          <div className="story-content">
            <Paragraph className="story-text">
              Về hành trình hình thành nên dự án này đó là vào một buổi học vào
              tháng 6 2026, Khi tôi và bạn tôi cùng ngồi lại, nói chuyện với
              nhau về một dự án cá nhân. Vì, Trước đó, chúng tôi đã hoàn thành
              môn lập trình web, nhưng dự án du lịch khi ấy vẫn còn quá dang dở,
              "không đâu vào đâu cả".
            </Paragraph>
            <Paragraph className="story-text">
              Không muốn bỏ cuộc, chúng tôi quyết định lấy đề tài đặt tour du
              lịch làm bước tiếp theo để hoàn thiện mảnh ghép còn thiếu ấy.{" "}
              <strong>TravelAway</strong> ra đời từ đấy - Nó không chỉ là một
              trang web đặt tour, mặc dù để mà nói dự án này cũng không gọi là
              tốt nhưng nó là cơ hội để chúng tôi có thể vừa học, vừa làm, và
              rút ra những bài học thực tế quý giá ấy.
            </Paragraph>
            <Paragraph className="story-text">
              Những ngày đầu, dự án còn lúng túng từ cách cấu trúc thư mục đến
              quy chuẩn đặt tên. Trải qua một khoảng thời gian đánh đổi bằng rất
              nhiều công sức và chất xám ngày đêm, dẫu biết TravelAway chưa thực
              sự hoàn hảo và còn nhiều thiếu sót, nhưng đó là minh chứng chân
              thực nhất cho sự nỗ lực của chúng tôi. Chúng tôi tự hào vì đã hoàn
              thiện được một chặng đường rất dài so với chính bản thân mình ngày
              trước! ^^
            </Paragraph>
            <Paragraph className="story-text">
              Cảm ơn những người đã tin tưởng, ủng hộ và đồng hành cùng chúng
              tôi trên chặng đường này.
              <br />
              <strong>
                Chân thành cảm ơn bạn vì đã ghé thăm TravelAway! 💙
              </strong>
            </Paragraph>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="team-page__members">
          <Title level={3} className="members-title">
            Đội ngũ phát triển
          </Title>
          <Row gutter={[32, 32]} justify="center">
            {teamMembers.map((member, index) => (
              <Col xs={24} md={12} lg={10} key={index}>
                <Card className="member-card" variant={false}>
                  <div className="member-card__header">
                    <div className="avatar-wrapper">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="avatar-img"
                      />
                    </div>
                  </div>
                  <div className="member-card__body">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-role">
                      <span className="role-icon">{member.icon}</span>
                      <span className="role-text">{member.role}</span>
                    </div>
                    <p className="member-desc">{member.description}</p>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      className="github-link"
                    >
                      <Button
                        type="default"
                        icon={<GithubOutlined />}
                        className="github-btn"
                        block
                      >
                        Xem GitHub
                      </Button>
                    </a>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
}

export default Team;
