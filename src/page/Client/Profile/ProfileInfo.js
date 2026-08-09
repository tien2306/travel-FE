import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin } from "../../../store/slices/loginSlice";
import AvatarSelector from "../../../components/Client/Profile/AvatarSelector";
import { Form, Input, Button, Row, Col, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { updateAuthMe } from "../../../services/user";
import { buildProfilePayload } from "../../../helpers/user/profileForm";
import { useTranslation } from "react-i18next";
import "./ProfileInfo.scss";

const ProfileInfo = () => {
  const { userInfo } = useOutletContext();
  const loginState = useSelector((state) => state.loginReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation("profile");

  // Load init data
  const initialValues = {
    email: userInfo?.email,
    username: userInfo?.username,
    fullName: userInfo?.fullName,
    phone: userInfo?.phone,
    address: userInfo?.address,
  };

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        email: userInfo.email,
        username: userInfo.username,
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        address: userInfo.address,
        avatar: userInfo.avatar || "",
      });
    }
  }, [userInfo, form]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const values = await form.validateFields();
        setLoading(true);
        // console.log(values);
        const { formData, newAvatarUrl } = buildProfilePayload(
          values,
          userInfo,
        );
        const res = await updateAuthMe(formData);
        if (res && res.success) {
          const serverAvatar = res.data?.avatar;
          const finalAvatar =
            newAvatarUrl === null ? null : serverAvatar || newAvatarUrl;

          // Loại bỏ avatar khỏi values | nghĩa là giá trị của form
          // Để lưu cái avater mới vào (finalAvatar)
          const { avatar: _discardAvatar, ...safeValues } = values;

          // Cập nhật Redux store
          const updatedUser = {
            ...userInfo, // thông tin cũ
            ...safeValues, // thông tin mới (ghi đè thông tin cũ)
            ...res.data, // thông tin mới từ server (ghi đè thông tin cũ)
            avatar: finalAvatar, // avatar mới
          };

          dispatch(
            checkLogin({
              status: loginState.isLogin,
              role: loginState.role,
              user: updatedUser,
            }),
          );

          // Cập nhật lại về dạng chuỗi, đỡ phải ôm giá trị object cũ
          form.setFieldValue("avatar", finalAvatar || "");

          message.success(t("info.saveSuccess"));
          setIsEditing(false);
        } else {
          message.error(
            t("info.saveFail") + (res?.message || t("info.errorAPI")),
          );
        }
      } catch (error) {
        console.log("Lỗi form hoặc gọi API:", error);
        message.error(t("info.errorAPI"));
      } finally {
        setLoading(false);
      }
    } else {
      // Mở khóa edit
      setIsEditing(true);
    }
  };

  return (
    <div className="p-info">
      <h2 className="p-info__title">{t("info.title")}</h2>
      <div className="p-info__card">
        <div className="p-info__form">
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            disabled={!isEditing}
          >
            {/* avatar */}
            <Form.Item name="avatar" style={{ margin: 0 }}>
              <AvatarSelector isEditing={isEditing} userInfo={userInfo} t={t} />
            </Form.Item>

            {/* email */}
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item label={t("info.emailLabel")} name="email">
                  <Input
                    readOnly
                    className={!isEditing ? "" : "ant-input-disabled"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("info.usernameLabel")} name="username">
                  <Input
                    readOnly
                    className={!isEditing ? "" : "ant-input-disabled"}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* tên đăng nhập và số điện thoại */}
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t("info.fullNameLabel")}
                  name="fullName"
                  rules={[{ required: true, message: t("info.fullNameReq") }]}
                >
                  <Input placeholder={t("info.fullNamePlaceholder")} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t("info.phoneLabel")}
                  name="phone"
                  validateTrigger="onSubmit"
                  rules={[
                    { required: true, message: t("info.phoneReq") },
                    {
                      pattern: /^0\d{9}$/,
                      message: t("info.phoneInv"),
                    },
                  ]}
                >
                  <Input placeholder={t("info.phonePlaceholder")} />
                </Form.Item>
              </Col>
            </Row>

            {/* địa chỉ */}
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item label={t("info.addressLabel")} name="address">
                  <Input placeholder={t("info.addressPlaceholder")} />
                </Form.Item>
              </Col>
            </Row>

            {/* button chỉnh, sửa */}
            <Row justify="end">
              <Col>
                <Button
                  type="primary"
                  icon={isEditing ? <SaveOutlined /> : null}
                  className={
                    isEditing ? "p-info__btn--save" : "p-info__btn--edit"
                  }
                  onClick={handleEditToggle}
                  disabled={false}
                  loading={loading}
                >
                  {isEditing ? t("info.saveBtn") : t("info.editBtn")}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
