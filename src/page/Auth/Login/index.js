import React, { useEffect, useState } from "react";
import { Form, Input, Checkbox, Button, message, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.scss";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../services/user";
import { checkLogin } from "../../../store/slices/loginSlice";
import { getCookie, setCookie } from "../../../helpers/cookie";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { defaultBgFromApi } = useOutletContext();

  // Xử lí nhớ tài khoản
  useEffect(() => {
    const savedEmail = getCookie("remembered_email");
    if (savedEmail) {
      // set giá trị cho antd
      form.setFieldsValue({
        email: savedEmail,
        remember: true,
      });
    }
  }, [form]);

  // Xử lí đăng nhập
  const onFinish = async (e) => {
    const { remember, ...account } = e;
    setLoading(true);
    try {
      const res = await login(account);
      if (res && res.success) {
        message.success("Đăng nhập thành công!");

        const token = res.data.accessToken;
        const userData = res.data.user;
        const userRole = res.data.user.role.name;

        // 1. Lưu token và data người dùng lên cookie
        setCookie("accessToken", token, 1);
        setCookie("user", JSON.stringify(userData), 1);

        // 2. xử lí ghi nhớ
        if (remember) {
          setCookie("remembered_email", account.email, 7);
        }
        // else {
        //   setCookie("remembered_email", "", -1);
        // }

        //3. Thay đổi trạng thái để header cập nhật lại giao diện
        dispatch(checkLogin({ status: true, role: userRole }));

        // 4. Điều hướng dựa theo quyền hạn
        if (userData.role.name === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        message.error(res.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi login:", error);
      message.error("Không thể kết nối đến máy chủ backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${defaultBgFromApi})` }}
    >
      <div className="background-overlay"></div>

      <Row justify="center" align="middle" className="login-row">
        <Col xs={22} sm={16} md={12} lg={10} xl={8}>
          <div className="login-card">
            <h2>Chào Mừng Trở Lại</h2>
            <p className="subtitle">Khám phá thế giới cùng EasyTour</p>

            {/* Form */}
            <Form
              form={form}
              name="login_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              initialValues={{ remember: true }}
            >
              {/* Tài khoản Email */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập email của bạn"
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>

              {/* Mật khẩu */}
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải từ 6 ký tự trở lên!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu"
                  size="large"
                  autoComplete="current-password"
                />
              </Form.Item>

              {/* Ghi nhớ */}
              <div className="form-actions">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>
                <a href="/forgot" className="forgot-password">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Button đăng nhập */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-login"
                  size="large"
                  loading={loading}
                >
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>

            <p className="register-text">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
