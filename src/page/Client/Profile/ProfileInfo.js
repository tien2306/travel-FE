import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin } from "../../../store/slices/loginSlice";
import AvatarSelector from "../../../components/Client/Profile/AvatarSelector";
import { Form, Input, Button, Row, Col, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { updateAuthMe } from "../../../services/user";
import { buildProfilePayload } from "../../../helpers/user/profileForm";
import "./ProfileInfo.scss";

const ProfileInfo = () => {
  const { userInfo } = useOutletContext();
  const loginState = useSelector((state) => state.loginReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

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

        const { formData, newAvatarUrl } = buildProfilePayload(values, userInfo);

        const res = await updateAuthMe(formData);

        if (res && res.success) {
          const serverAvatar = res.data?.avatar;
          // Nếu user xóa avatar (newAvatarUrl === null) → ưu tiên ý định xóa
          // Nếu user upload/chọn ảnh → dùng avatar từ server, fallback preview
          const finalAvatar =
            newAvatarUrl === null ? null : serverAvatar || newAvatarUrl;

          // Loại bỏ avatar khỏi values (vì có thể là object { file, preview })
          const { avatar: _discardAvatar, ...safeValues } = values;

          // Cập nhật Redux store
          const updatedUser = {
            ...userInfo,
            ...safeValues,
            ...res.data,
            avatar: finalAvatar,
          };

          dispatch(
            checkLogin({
              status: loginState.isLogin,
              role: loginState.role,
              user: updatedUser,
            }),
          );

          // Reset form avatar value về string từ server
          form.setFieldValue("avatar", finalAvatar || "");

          message.success("Lưu thông tin thành công!");
          setIsEditing(false);
        } else {
          message.error(
            "Cập nhật thất bại: " + (res?.message || "Lỗi không xác định"),
          );
        }
      } catch (error) {
        console.log("Lỗi form hoặc gọi API:", error);
        message.error("Lỗi kết nối hoặc cập nhật thất bại!");
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
      <h2 className="p-info__title">Tài khoản</h2>
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
              <AvatarSelector isEditing={isEditing} userInfo={userInfo} />
            </Form.Item>

            {/* email */}
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email">
                  <Input
                    readOnly
                    className={!isEditing ? "" : "ant-input-disabled"}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Tên đăng nhập" name="username">
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
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input placeholder="Nhập họ và tên..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại..." />
                </Form.Item>
              </Col>
            </Row>

            {/* địa chỉ */}
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item label="Địa chỉ" name="address">
                  <Input placeholder="Nhập địa chỉ của bạn..." />
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
                  {isEditing ? "Lưu lại" : "Chỉnh sửa thông tin"}
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
