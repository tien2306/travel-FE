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

function Notify(props) {
  const apiData = [
    {
      id: "profile",
      title: "My Profile",
      icon: <UserOutlined />,
      to: "/profile",
    },
    { id: "inbox", title: "Inbox", icon: <MessageOutlined />, to: "/inbox" },
    {
      id: "noti",
      title: "Notifications",
      icon: <BellOutlined />,
      to: "/notifications",
    },
    {
      id: "setting",
      title: "Account Settings",
      icon: <SettingOutlined />,
      to: "/settings",
    },
    { id: "logout", title: "Log Out", icon: <LogoutOutlined />, to: "/logout" },
  ];

  // 2. Map data theo đúng chuẩn cấu trúc items của Antd Dropdown
  const items = apiData.map((item) => ({
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
    <NavLink>
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <div className="user-menu__trigger">
          <HomeOutlined className="icons-trigger" />
          <span>My Dashboard</span>
          <DownOutlined className="icons-trigger" />
        </div>
      </Dropdown>
    </NavLink>
  );
}

export default Notify;
