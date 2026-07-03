import {
  BookOutlined,
  CalendarOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    key: "/admin",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/admin/tours",
    icon: <BookOutlined />,
    label: "Tours",
  },
  {
    key: "/admin/bookings",
    icon: <CalendarOutlined />,
    label: "Bookings",
  },
  {
    key: "/admin/users",
    icon: <TeamOutlined />,
    label: "Users",
  },
  {
    key: "/admin/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

function SidebarAdmin({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey =
    menuItems.find((item) => item.key === location.pathname)?.key || "/admin";

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="admin-sidebar">
      <div
        className="admin-sidebar__brand"
        onClick={() => handleMenuClick({ key: "/admin" })}
      >
        <div className="admin-sidebar__logo">TA</div>
        <div>
          <h2>Travels Away</h2>
          <span>Admin</span>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        className="admin-sidebar__menu"
      />
    </div>
  );
}

export default SidebarAdmin;
