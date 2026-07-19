import { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { IconMapPin, IconPhone, IconMail, IconSend, IconCheck } from "../../../components/Common/Icons";
import "./Contact.scss";

const { TextArea } = Input;

// ─── Info blocks data ─────────────────────────────────────────
const INFO_BLOCKS = [
  {
    Icon: IconMapPin,
    title: "Address",
    lines: ["132 Nguyễn Đình Chiểu,", "Quận 3, TP. Hồ Chí Minh"],
  },
  {
    Icon: IconPhone,
    title: "Mobile",
    lines: ["+84 28 3822 9988", "+84 28 3822 9989"],
  },
  {
    Icon: IconMail,
    title: "Email",
    lines: ["hotro@travelgo.vn", "booking@travelgo.vn"],
  },
];

// ─── Component ───────────────────────────────────────────────
function Contact() {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const onFinish = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    form.resetFields();
  };

  return (
    <section className="contact-page">
      <div className="contact-container">

        {/* ── Section Header ── */}
        <div className="contact-section-header">
          <p className="contact-section-label">Contact Us</p>
          <h1 className="contact-section-title">Contact For Any Query</h1>
        </div>

        {/* ── Main grid ── */}
        <div className="contact-main-grid">

          {/* Info card */}
          <div className="contact-info-card">
            {INFO_BLOCKS.map(({ Icon, title, lines }) => (
              <div className="contact-info-block" key={title}>
                <div className="contact-info-icon-wrap">
                  <Icon size={26} />
                </div>
                <h4 className="contact-info-block-title">{title}</h4>
                {lines.map((line, i) => (
                  <p className="contact-info-block-text" key={i}>{line}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Form panel */}
          <div className="contact-form-panel">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <IconCheck size={28} />
                </div>
                <p className="contact-success__title">Gửi thành công!</p>
                <p className="contact-success__sub">
                  Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                </p>
                <Button
                  id="contact-send-another-btn"
                  type="primary"
                  onClick={handleReset}
                  style={{ borderRadius: 8 }}
                >
                  Gửi tin nhắn khác
                </Button>
              </div>
            ) : (
              <>
                <h2 className="contact-form-title">Send us a message</h2>
                <p className="contact-form-sub">
                  Điền thông tin bên dưới, đội ngũ tư vấn TravelGo sẽ liên hệ lại sớm nhất.
                </p>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  requiredMark={false}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label="Your Name"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                      >
                        <Input
                          id="contact-name-input"
                          placeholder="Nguyễn Văn A"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Your Email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          { type: "email",   message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input
                          id="contact-email-input"
                          placeholder="example@email.com"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: "Vui lòng nhập chủ đề" }]}
                  >
                    <Input
                      id="contact-subject-input"
                      placeholder="Tiêu đề nội dung liên hệ..."
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
                  >
                    <TextArea
                      id="contact-message-input"
                      placeholder="Nhập nội dung tin nhắn của bạn tại đây..."
                      rows={6}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      id="contact-submit-btn"
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={!loading ? <IconSend size={16} /> : null}
                      className="contact-submit-btn"
                      block
                    >
                      {loading ? "Đang gửi..." : "Send Message"}
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </div>
        </div>

        {/* ── Google Map ── */}
        <div className="contact-map-card">
          <iframe
            title="TravelGo Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.6907!3d10.7771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9522!2zMTMyIE5ndXnhu4VuIMSQw6xuaCBDaGnhu4N1LCBR3KF1IDMsIFRow6BuaCBwaeG7kSBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

      </div>
    </section>
  );
}

export default Contact;
