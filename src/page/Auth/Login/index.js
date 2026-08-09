import React, { useEffect, useState } from "react";
import { Form, Input, Checkbox, Button, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "./Login.scss";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../services/user";
import { checkLogin } from "../../../store/slices/loginSlice";
import { getCookie, setCookie } from "../../../helpers/auth/cookie";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { defaultBgFromApi } = useOutletContext();
  const { t } = useTranslation("auth");

  const from = location.state?.from || "/";

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
        Swal.fire({
          icon: "success",
          title: t("login.success"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        const token = res.data.accessToken;
        const userData = res.data.user;
        const userRole = res.data.user.role.name;

        // 1. Lưu token lên cookie
        setCookie("accessToken", token, 1);

        // 2. xử lí ghi nhớ
        if (remember) {
          setCookie("remembered_email", account.email, 7);
        }
        //3. Thay đổi trạng thái để header cập nhật lại giao diện
        dispatch(checkLogin({ status: true, role: userRole, user: userData }));

        // 4. Điều hướng dựa theo quyền hạn
        if (userData.role.name === "ADMIN") {
          navigate("/admin");
        } else {
          navigate(from);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: res.message || t("login.fail"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Lỗi login:", error);
      Swal.fire({
        icon: "error",
        title: t("login.noServer"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${defaultBgFromApi})` }}
    >
      <div className="login-container__overlay"></div>

      <Row justify="center" align="middle" className="login-container__row">
        <Col xs={22} sm={16} md={12} lg={10} xl={8}>
          <div className="login-container__card">
            <h2>{t("login.welcome")}</h2>
            <p className="login-container__subtitle">{t("login.subtitle")}</p>

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
                label={t("login.emailLabel")}
                name="email"
                rules={[
                  { required: true, message: t("login.emailReq") },
                  { type: "email", message: t("login.emailInv") },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t("login.emailPlh")}
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>

              {/* Mật khẩu */}
              <Form.Item
                label={t("login.pwdLabel")}
                name="password"
                validateTrigger="onSubmit"
                rules={[
                  { required: true, message: t("login.pwdReq") },
                  { min: 6, message: t("login.pwdMin") },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t("login.pwdPlh")}
                  size="large"
                  autoComplete="current-password"
                />
              </Form.Item>

              {/* Ghi nhớ */}
              <div className="login-container__form-actions">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>{t("login.remember")}</Checkbox>
                </Form.Item>
                <a href="/forgot" className="login-container__forgot">
                  {t("login.forgot")}
                </a>
              </div>

              {/* Button đăng nhập */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-container__btn"
                  size="large"
                  loading={loading}
                >
                  {t("login.loginBtn")}
                </Button>
              </Form.Item>
            </Form>

            <p className="login-container__register-text">
              {t("login.noAccount")}{" "}
              <a href="/register">{t("login.registerNow")}</a>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
