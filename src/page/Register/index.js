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
// import { post } from "../../../utils/request";
import "./Register.scss";
import BG from "../../images/carousel-1.jpg";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/userService";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { confirmPassword, ...account } = values;

    setLoading(true);
    try {
      const res = await register(account);
      if (res && res.success) {
        message.success("Đăng ký tài khoản thành công!");
        navigate("/login");
      } else {
        message.error("Đăng ký thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi register:", error);
      message.error("Không thể kết nối đến máy chủ backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="background-overlay"></div>

      {/* Dùng Row và Col bao bọc toàn bộ card để quản lý responsive */}
      <Row justify="center" align="middle" className="register-row">
        <Col xs={22} sm={20} md={16} lg={14} xl={12}>
          <div className="register-card">
            <h2>Tạo Tài Khoản Mới</h2>
            <p className="subtitle">
              Đăng ký để trải nghiệm dịch vụ cùng EasyTour
            </p>

            <Form
              // form={form}
              name="register_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              {/* Dùng Row lồng bên trong Form để chia cột cho từng Form.Item */}
              <Row gutter={[20, 0]}>
                {/* Tên tài khoản */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tên tài khoản (Username)"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên tài khoản!",
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
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
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
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không đúng định dạng!" },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="abc@gmail.com"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Số điện thoại */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại phải gồm 10 chữ số!",
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
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ!" },
                    ]}
                  >
                    <Input
                      prefix={<HomeOutlined />}
                      placeholder="Ví dụ: Ho Chi Minh"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Mật khẩu */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                      { min: 6, message: "Mật khẩu từ 6 ký tự trở lên!" },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập mật khẩu"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Xác nhận mật khẩu */}
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng xác nhận mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Mật khẩu xác nhận không khớp!"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Nhập lại mật khẩu"
                      size="large"
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
                      Đăng Ký
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <p className="login-text">
              Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
