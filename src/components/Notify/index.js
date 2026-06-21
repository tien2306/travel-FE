import { Dropdown, Space } from "antd";
import { Link, NavLink } from "react-router-dom";
import {
  HomeOutlined,
  DownOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Notify.scss";
import { useSelector } from "react-redux";

function Notify(props) {
  const isLogin = useSelector((state) => state.loginReducer);

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
    { id: "logout", title: "Log Out", icon: <LogoutOutlined />, to: "/logout" }, // Sửa id thành "logout"
  ];

  const currentMenuData = isLogin ? loggedInMenu : loggedOutMenu;

  const items = currentMenuData.map((item) => ({
    key: item.id,
    // danger: item.id === "logout",
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
