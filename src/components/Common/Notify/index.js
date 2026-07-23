import { Dropdown, Space } from "antd";
import { Link, NavLink, useLocation } from "react-router-dom"; // Thêm useLocation vào đây
import {
  HomeOutlined,
  DownOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import "./Notify.scss";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function Notify(props) {
  // Lấy đường dẫn URL hiện tại của trình duyệt
  const location = useLocation();
  const { t } = useTranslation("header");

  // Lấy dữ liệu đăng nhập và quyền hạn từ Redux Store
  const state = useSelector((state) => state.loginReducer);
  const isLogin = state?.isLogin;
  const role = state?.role;

  // Cấu hình menu cho người dùng chưa đăng nhập
  const loggedOutMenu = [
    {
      id: "profile",
      title: t("notify.profile"),
      icon: <UserOutlined />,
      to: "/profile",
    },
    { id: "inbox", title: t("notify.inbox"), icon: <MessageOutlined />, to: "/inbox" },
    {
      id: "noti",
      title: t("notify.notifications"),
      icon: <BellOutlined />,
      to: "/notifications",
    },
    {
      id: "setting",
      title: t("notify.settings"),
      icon: <SettingOutlined />,
      to: "/settings",
    },
  ];

  // Cấu hình menu cơ bản cho người đã đăng nhập
  const loggedInMenu = [
    {
      id: "profile",
      title: t("notify.profile"),
      icon: <UserOutlined />,
      to: "/profile",
    },
    { id: "inbox", title: t("notify.inbox"), icon: <MessageOutlined />, to: "/inbox" },
    {
      id: "noti",
      title: t("notify.notifications"),
      icon: <BellOutlined />,
      to: "/notifications",
    },
    {
      id: "setting",
      title: t("notify.settings"),
      icon: <SettingOutlined />,
      to: "/settings",
    },
  ];

  // Kiểm tra xem người dùng có đang đứng ở các trang admin hay không
  const isAdminPage = location.pathname.startsWith("/admin");

  // Nếu là tài khoản ADMIN và đồng thời KHÔNG PHẢI đang ở trang admin thì mới hiển thị nút này
  if (role === "ADMIN" && !isAdminPage) {
    loggedInMenu.push({
      id: "admin",
      title: t("notify.admin"),
      icon: <LayoutOutlined />,
      to: "/admin",
    });
  }

  // Luôn luôn thêm nút Log Out vào cuối danh sách menu đăng nhập
  loggedInMenu.push({
    id: "logout",
    title: t("notify.logout"),
    icon: <LogoutOutlined />,
    to: "/logout",
  });

  // Lựa chọn mảng dữ liệu menu dựa trên trạng thái đăng nhập
  const currentMenuData = isLogin ? loggedInMenu : loggedOutMenu;

  // Chuyển đổi mảng dữ liệu thành cấu trúc items tuân thủ quy định của Ant Design Dropdown
  const items = currentMenuData.map((item) => ({
    key: item.id,
    label: (
      <Link to={item.to} className="user-menu__link">
        <Space size="middle">
          {item.icon}
          <span>{item.title}</span>
        </Space>
      </Link>
    ),
  }));

  return (
    <NavLink to="#">
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <div className="user-menu__trigger" style={{ cursor: "pointer" }}>
          <HomeOutlined className="icons-trigger" />
          <span>{t("notify.myDashboard")}</span>
          <DownOutlined className="icons-trigger" />
        </div>
      </Dropdown>
    </NavLink>
  );
}

export default Notify;
