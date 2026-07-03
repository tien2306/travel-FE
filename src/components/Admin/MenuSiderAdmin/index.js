import { Menu } from "antd";
import {
  LayoutOutlined,
  CalendarOutlined,
  PlusOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

function MenuSider() {
  const items = [
    {
      key: "home",
      label: <Link to="/admin">DashBoard</Link>,
      icon: <LayoutOutlined />,
    },

    {
      key: "book-tour",
      label: <Link to="book-tour">Book Tour</Link>,
      icon: <CalendarOutlined />,
    },
    {
      key: "create-Tour",
      label: <Link to="create-tour">Create Tour</Link>,
      icon: <PlusOutlined />,
    },
    {
      key: "list-tour",
      label: <Link to="list-tour">List Tour</Link>,
      icon: <BarsOutlined />,
    },
  ];
  return (
    <>
      <Menu
        mode="inline"
        items={items}
        defaultSelectedKeys={["home"]}
        // defaultOpenKeys={["menu-1"]}
      />
    </>
  );
}

export default MenuSider;
