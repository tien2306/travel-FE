import React, { useMemo } from "react";
import { Dropdown, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  LayoutOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import "./Notify.scss";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAvatarColor } from "../../../helpers/user/avatar";
import { getAvatarDisplayUrl } from "../../../helpers/user/avatarUrl";
import { Avatar } from "antd";
function Notify() {
  const location = useLocation();
  const { t } = useTranslation("header");

  const state = useSelector((state) => state.loginReducer);
  const role = state?.role;
  const user = state?.user;

  const userName = user?.username || user?.fullName || "User";
  const avatarText = userName.charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(avatarText);

  const isAdminPage = location.pathname.startsWith("/admin");

  // Dùng useMemo để tránh tạo lại mảng menu sau mỗi lần render
  const menuItemsData = useMemo(() => {
    // 1. Menu cơ bản luôn có
    const baseMenu = [
      {
        id: "profile",
        title: t("notify.profile"),
        icon: <UserOutlined />,
        to: "/profile",
      },
      {
        id: "favorites",
        title: t("notify.favorites"),
        icon: <HeartOutlined />,
        to: "/favorites",
      },
      // {
      //   id: "inbox",
      //   title: t("notify.inbox"),
      //   icon: <MessageOutlined />,
      //   to: "/inbox",
      // },
      // {
      //   id: "noti",
      //   title: t("notify.notifications"),
      //   icon: <BellOutlined />,
      //   to: "/notifications",
      // },
      // {
      //   id: "setting",
      //   title: t("notify.settings"),
      //   icon: <SettingOutlined />,
      //   to: "/settings",
      // },
    ];

    // 2. Thêm nút Admin nếu là quyền ADMIN và KHÔNG ở trang admin
    if (role === "ADMIN" && !isAdminPage) {
      baseMenu.push({
        id: "admin",
        title: t("notify.admin"),
        icon: <LayoutOutlined />,
        to: "/admin",
      });
    }

    // 3. Luôn luôn có nút Đăng xuất ở cuối
    baseMenu.push({
      id: "logout",
      title: t("notify.logout"),
      icon: <LogoutOutlined />,
      to: "/logout",
    });

    return baseMenu;
  }, [t, role, isAdminPage]);

  // Chuyển đổi mảng dữ liệu thành cấu trúc items của Ant Design
  const items = menuItemsData.map((item) => ({
    key: item.id,
    label: (
      <Link to={item.to} className="user-menu__link">
        <Space size="small">
          {item.icon}
          <span>{item.title}</span>
        </Space>
      </Link>
    ),
  }));

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      // overlayClassName="notify-dropdown-overlay"
      classNames={{ root: "notify-dropdown-overlay" }}
      arrow={true}
    >
      <div
        className={`user-menu__trigger ${isAdminPage ? "user-menu__trigger--admin" : ""}`}
      >
        <Avatar
          size={28}
          src={getAvatarDisplayUrl(user?.avatar)}
          style={{
            backgroundColor: user?.avatar ? "transparent" : avatarColor.bg,
            color: avatarColor.color,
            fontWeight: "bold",
          }}
          className="user-menu__avatar"
        >
          {!user?.avatar && avatarText}
        </Avatar>
        <span className="user-menu__name">{userName}</span>
        <DownOutlined className="icons-trigger" />
      </div>
    </Dropdown>
  );
}

export default Notify;
