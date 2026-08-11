import { useState, useRef } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { FiMapPin, FiPhone, FiMail, FiSend, FiCheck } from "react-icons/fi";

import "./Contact.scss";
import { useContactAnimation } from "./animations";

const { TextArea } = Input;

// ─── Info blocks data ────────────────────────────────────────
const getInfoBlocks = (t) => [
  {
    Icon: FiMapPin,
    title: t("info.addressTitle"),
    lines: ["132 Nguyễn Đình Chiểu,", "Quận 3, TP. Hồ Chí Minh"],
  },
  {
    Icon: FiPhone,
    title: t("info.mobileTitle"),
    lines: ["+84 28 3822 9988", "+84 28 3822 9989"],
  },
  {
    Icon: FiMail,
    title: t("info.emailTitle"),
    lines: ["hotro@travelgo.vn", "booking@travelgo.vn"],
  },
];

// ─── Component ───────────────────────────────────────────────
function Contact() {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("contact");

  // Tạo một cái nhãn gắn vào thẻ HTML ở dưới, giúp GSAP định vị chính xác khu vực cần scroll
  const containerRef = useRef(null);
  useContactAnimation(containerRef);

  const onFinish = async () => {
    setLoading(true);
    // Ép trình duyệt đợi 0.9 giây (giả lập thời gian gửi dữ liệu lên server) rồi mới báo thành công
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    form.resetFields();
  };

  return (
    <section className="contact" ref={containerRef}>
      <div className="contact__container">
        {/* ── Section Header ── */}
        <div className="contact__header">
          <p className="contact__label">{t("header.label")}</p>
          <h1 className="contact__title">{t("header.title")}</h1>
        </div>

        {/* ── Main grid ── */}
        <div className="contact__grid">
          {/* Info card */}
          <div className="contact__info-card">
            {getInfoBlocks(t).map(({ Icon, title, lines }) => (
              <div className="contact__info-block" key={title}>
                <div className="contact__info-icon">
                  <Icon size={26} />
                </div>
                <h4 className="contact__info-title">{title}</h4>
                {lines.map((line, i) => (
                  <p className="contact__info-text" key={i}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Form panel */}
          <div className="contact__form-panel">
            {submitted ? (
              <div className="contact__success">
                <div className="contact__success-icon">
                  <FiCheck size={28} />
                </div>
                <p className="contact__success-title">{t("success.title")}</p>
                <p className="contact__success-sub">{t("success.sub")}</p>
                <Button
                  id="contact-send-another-btn"
                  type="primary"
                  onClick={handleReset}
                  style={{ borderRadius: 8 }}
                >
                  {t("success.button")}
                </Button>
              </div>
            ) : (
              <>
                <h2 className="contact__form-title">{t("form.title")}</h2>
                <p className="contact__form-sub">{t("form.sub")}</p>

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
                        label={t("form.nameLabel")}
                        rules={[{ required: true, message: t("form.nameReq") }]}
                      >
                        <Input
                          id="contact-name-input"
                          placeholder={t("form.namePlh")}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label={t("form.emailLabel")}
                        rules={[
                          { required: true, message: t("form.emailReq") },
                          { type: "email", message: t("form.emailInv") },
                        ]}
                      >
                        <Input
                          id="contact-email-input"
                          placeholder={t("form.emailPlh")}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="subject"
                    label={t("form.subjectLabel")}
                    rules={[{ required: true, message: t("form.subjectReq") }]}
                  >
                    <Input
                      id="contact-subject-input"
                      placeholder={t("form.subjectPlh")}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label={t("form.msgLabel")}
                    rules={[{ required: true, message: t("form.msgReq") }]}
                  >
                    <TextArea
                      id="contact-message-input"
                      placeholder={t("form.msgPlh")}
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
                      icon={!loading ? <FiSend size={16} /> : null}
                      className="contact__submit-btn"
                      block
                    >
                      {loading ? t("form.sending") : t("form.send")}
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </div>
        </div>

        {/* ── Google Map ── */}
        <div className="contact__map-card">
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
