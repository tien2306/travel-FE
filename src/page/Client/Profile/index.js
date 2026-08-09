import React from "react";
import { Menu, Avatar, Divider } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  ShoppingOutlined,
  TeamOutlined,
  MessageOutlined,
  HeartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/slices/loginSlice";
import { getAvatarColor } from "../../../helpers/user/avatar";
import { getAvatarDisplayUrl } from "../../../helpers/user/avatarUrl";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "./ProfileLayout.scss";

const ProfileLayout = () => {
  const { user: userInfo } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("profile");

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      Swal.fire({
        title: t("logoutConfirm.title"),
        text: t("logoutConfirm.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e50027",
        cancelButtonColor: "#888",
        confirmButtonText: t("logoutConfirm.confirmBtn"),
        cancelButtonText: t("logoutConfirm.cancelBtn"),
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(logout());
          navigate("/");
        }
      });
      return;
    }
    navigate(e.key);
  };

  if (!userInfo) return null;

  // Lấy chữ cái đầu của tên để làm Avatar
  const avatarText = userInfo.username
    ? userInfo.username?.charAt(0).toUpperCase()
    : userInfo.fullName?.charAt(0).toUpperCase();

  // Xử lí màu avatar
  const avatarColor = getAvatarColor(avatarText);

  // Xử lí hiển thị avatar
  const avatarSrc = getAvatarDisplayUrl(userInfo.avatar);

  // Highlight menu hiện tại
  const selectedKey = location.pathname;

  return (
    <div className="profile">
      <div className="profile__layout">
        {/* SIDEBAR BÊN TRÁI */}
        <div className="profile__sidebar">
          <div className="profile__user">
            <Avatar
              size={56}
              src={avatarSrc}
              style={{
                backgroundColor: avatarSrc ? "transparent" : avatarColor.bg,
                color: avatarColor.color,
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {avatarText}
            </Avatar>
            <div className="profile__details">
              <div className="profile__email">
                {userInfo.email || userInfo.username}
              </div>
            </div>
          </div>

          <Divider className="profile__divider" />

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            className="profile__menu"
          >
            <Menu.Item key="/profile" icon={<UserOutlined />}>
              {t("menu.profile")}
            </Menu.Item>
            <Menu.Item key="/profile/orders" icon={<ShoppingOutlined />}>
              {t("menu.orders")}
            </Menu.Item>
            <Menu.Item key="/profile/passengers" icon={<TeamOutlined />}>
              {t("menu.passengers")}
            </Menu.Item>
            <Menu.Item key="/profile/reviews" icon={<MessageOutlined />}>
              {t("menu.reviews")}
            </Menu.Item>
            <Menu.Item
              key="/profile/favorites"
              icon={<HeartOutlined />}
              className="last-main-item"
            >
              {t("menu.favorites")}
            </Menu.Item>

            <Divider className="profile__divider" />

            <Menu.Item
              key="logout"
              icon={<LogoutOutlined />}
              className="logout-menu-item"
            >
              {t("menu.logout")}
            </Menu.Item>
          </Menu>
        </div>

        {/* NỘI DUNG BÊN PHẢI (NESTED ROUTES) */}
        <div className="profile__content">
          <Outlet context={{ userInfo }} />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
