import { Menu } from "antd";
import {
  LayoutOutlined,
  FlagOutlined,
  SlidersOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

function MenuSider() {
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("list-tour")) return "list-tour";
    if (path.includes("list-carousel")) return "list-carousel";
    if (path.includes("list-user")) return "list-user";
    if (path === "/admin" || path === "/admin/") return "home";
    return "home";
  };

  const items = [
    {
      key: "home",
      label: <Link to="/admin">DashBoard</Link>,
      icon: <LayoutOutlined />,
    },
    {
      key: "list-tour",
      label: <Link to="/admin/list-tour">Tour</Link>,
      icon: <FlagOutlined />,
    },
    {
      key: "list-carousel",
      label: <Link to="/admin/list-carousel">Carousel</Link>,
      icon: <SlidersOutlined />,
    },
    {
      key: "list-user",
      label: <Link to="/admin/list-user">User</Link>,
      icon: <UserOutlined />,
    },
  ];

  return <Menu mode="inline" items={items} selectedKeys={[getSelectedKey()]} />;
}

export default MenuSider;
