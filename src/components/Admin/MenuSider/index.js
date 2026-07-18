import { Menu } from "antd";
import {
  LayoutOutlined,
  CalendarOutlined,
  PlusOutlined,
  BarsOutlined,
  FlagOutlined,
  SlidersOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function MenuSider() {
  const location = useLocation();

  const [openKeys, setOpenKeys] = useState([]);

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("book-tour")) return "book-tour";
    if (path.includes("create-tour")) return "create-tour";
    if (path.includes("list-tour")) return "list-tour";
    if (path.includes("create-carousel")) return "create-carousel";
    if (path.includes("list-carousel")) return "list-carousel";
    if (path === "/admin" || path === "/admin/") return "home";
    return "home";
  };

  // 2. Hàm lắng nghe khi bạn click đóng/mở menu cha
  const onOpenChange = (keys) => {
    setOpenKeys(keys); // Cập nhật danh sách menu đang mở
  };

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
        selectedKeys={[getSelectedKey()]}
        // THAY ĐỔI Ở ĐÂY: Quản lý đóng mở bằng state
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      />
    </>
  );
}

export default MenuSider;
