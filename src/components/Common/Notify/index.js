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

function Notify(props) {
  // Lấy đường dẫn URL hiện tại của trình duyệt
  const location = useLocation();

  // Lấy dữ liệu đăng nhập và quyền hạn từ Redux Store
  const state = useSelector((state) => state.loginReducer);
  const isLogin = state?.isLogin;
  const role = state?.role;

  // Cấu hình menu cho người dùng chưa đăng nhập
  const loggedOutMenu = [
    {
      id: "profile",
      title: "Trang cá nhân",
      icon: <UserOutlined />,
      to: "/profile",
    },
    { id: "inbox", title: "Tin nhắn", icon: <MessageOutlined />, to: "/inbox" },
    {
      id: "noti",
      title: "Thông báo",
      icon: <BellOutlined />,
      to: "/notifications",
    },
    {
      id: "setting",
      title: "Cài đặt",
      icon: <SettingOutlined />,
      to: "/settings",
    },
  ];

  // Cấu hình menu cơ bản cho người đã đăng nhập
  const loggedInMenu = [
    {
      id: "profile",
      title: "Trang cá nhân",
      icon: <UserOutlined />,
      to: "/profile",
    },
    { id: "inbox", title: "Tin nhắn", icon: <MessageOutlined />, to: "/inbox" },
    {
      id: "noti",
      title: "Thông báo",
      icon: <BellOutlined />,
      to: "/notifications",
    },
    {
      id: "setting",
      title: "Cài đặt",
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
      title: "Trang quản trị",
      icon: <LayoutOutlined />,
      to: "/admin",
    });
  }

  // Luôn luôn thêm nút Log Out vào cuối danh sách menu đăng nhập
  loggedInMenu.push({
    id: "logout",
    title: "Log Out",
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
          <span>My Dashboard</span>
          <DownOutlined className="icons-trigger" />
        </div>
      </Dropdown>
    </NavLink>
  );
}

export default Notify;
