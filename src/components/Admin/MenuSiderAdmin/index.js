import { Menu } from "antd";
import {
  LayoutOutlined,
  CalendarOutlined,
  PlusOutlined,
  BarsOutlined,
  FlagOutlined,
  SlidersOutlined,
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
      key: "Tour",
      label: "Tour",
      icon: <FlagOutlined />,
      children: [
        {
          key: "book-tour",
          label: <Link to="book-tour">Book Tour</Link>,
          icon: <CalendarOutlined />,
        },
        {
          key: "create-tour",
          label: <Link to="create-tour">Create Tour</Link>,
          icon: <PlusOutlined />,
        },
        {
          key: "list-tour",
          label: <Link to="list-tour">List Tour</Link>,
          icon: <BarsOutlined />,
        },
      ],
    },
    {
      key: "hero-carousel",
      label: "Hero Carousel",
      icon: <SlidersOutlined />,
      children: [
        {
          key: "create-carousel",
          label: <Link to="create-carousel">Create Carousel</Link>,
          icon: <PlusOutlined />,
        },
        {
          key: "list-carousel",
          label: <Link to="list-carousel">List Carousel</Link>,
          icon: <BarsOutlined />,
        },
      ],
    },
  ];

  return (
    <>
      <Menu
        mode="inline"
        items={items}
        defaultSelectedKeys={["home"]}
        defaultOpenKeys={["Tour", "hero-carousel"]}
      />
    </>
  );
}

export default MenuSider;
