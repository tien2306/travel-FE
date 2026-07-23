import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import "./Register.scss";
import { useNavigate, useOutletContext } from "react-router-dom";
import { register } from "../../../services/user";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { defaultBgFromApi } = useOutletContext();
  const { t } = useTranslation("auth");

  // Xử lí đăng ký
  const onFinish = async (values) => {
    const { confirmPassword, ...account } = values;

    setLoading(true);
    try {
      const res = await register(account);
      if (res && res.success) {
        message.success(t("register.success"));
        navigate("/login");
      } else {
        message.error(res.message || t("register.fail"));
      }
    } catch (error) {
      console.error("Lỗi register:", error);
      message.error(t("login.noServer")); // Use the same backend error msg
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${defaultBgFromApi})` }}
    >
      <div className="background-overlay"></div>

      {/* Dùng Row và Col bao bọc toàn bộ card để quản lý responsive */}
      <Row justify="center" align="middle" className="register-row">
        <Col xs={22} sm={20} md={16} lg={14} xl={12}>
          <div className="register-card">
            <h2>{t("register.title")}</h2>
            <p className="subtitle">
              {t("register.subtitle")}
            </p>

            <Form
              name="register_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Row gutter={[20, 0]}>
                {/* Tên tài khoản */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t("register.usernameLabel")}
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: t("register.usernameReq"),
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="nguyenvana"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Họ và tên */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t("register.fullNameLabel")}
                    name="fullName"
                    rules={[
                      { required: true, message: t("register.fullNameReq") },
                    ]}
                  >
                    <Input
                      prefix={<IdcardOutlined />}
                      placeholder="Nguyen Van Huy"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Email */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t("register.emailLabel")}
                    name="email"
                    rules={[
                      { required: true, message: t("register.emailReq") },
                      { type: "email", message: t("login.emailInv") },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="abc@gmail.com"
                      size="large"
                      autoComplete="email"
                    />
                  </Form.Item>
                </Col>

                {/* Số điện thoại */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t("register.phoneLabel")}
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: t("register.phoneReq"),
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: t("register.phoneFormat"),
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="0912312312"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Địa chỉ - Chiếm trọn 1 hàng độc lập */}
                <Col xs={24}>
                  <Form.Item
                    label={t("register.addressLabel")}
                    name="address"
                    rules={[
                      { required: true, message: t("register.addressReq") },
                    ]}
                  >
                    <Input
                      prefix={<HomeOutlined />}
                      placeholder={t("register.addressPlh")}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Mật khẩu */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t("register.pwdLabel")}
                    name="password"
                    rules={[
                      { required: true, message: t("register.pwdReq") },
                      { min: 6, message: t("login.pwdMin") },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder={t("login.pwdPlh")}
                      size="large"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>

                {/* Xác nhận mật khẩu */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label={t("register.pwdConfirmLabel")}
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: t("register.pwdConfirmReq"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(t("register.pwdMismatch")),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder={t("register.pwdConfirmPlh")}
                      size="large"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>

                {/* Nút Đăng ký */}
                <Col xs={24}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="btn-register"
                      size="large"
                      loading={loading}
                    >
                      {t("register.registerBtn")}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <p className="login-text">
              {t("register.hasAccount")} <a href="/login">{t("register.loginNow")}</a>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
