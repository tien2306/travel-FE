import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Drawer,
  Input,
  Layout,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";
import { setCookie } from "../../helpers/cookie";
import Sidebar from "./Sidebar";
import "./admin.scss";

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/tours": "Tour Management",
  "/admin/bookings": "Bookings",
  "/admin/users": "Users",
  "/admin/settings": "Settings",
};

const profileItems = [
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Account settings",
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Sign out",
    danger: true,
  },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = useMemo(() => {
    return pageTitles[location.pathname] || "Travels Away Admin";
  }, [location.pathname]);

  const handleProfileMenuClick = ({ key }) => {
    if (key !== "logout") {
      return;
    }

    Modal.confirm({
      title: "Sign out of admin?",
      content: "Your current admin session will be ended.",
      okText: "Sign out",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        setCookie("accessToken", "", -1);
        setCookie("user", "", -1);
        dispatch(checkLogin(false));
        message.success("Signed out successfully");
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <Layout className="admin-layout">
      <Sider width={260} className="admin-layout__sider" breakpoint="lg" collapsedWidth="0">
        <Sidebar />
      </Sider>

      <Drawer
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={280}
        className="admin-layout__drawer"
        styles={{ body: { padding: 0 } }}
      >
        <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
      </Drawer>

      <Layout className="admin-layout__main">
        <Header className="admin-layout__header">
          <div className="admin-layout__title-group">
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              className="admin-layout__mobile-button"
              onClick={() => setMobileMenuOpen(true)}
            />

            <div>
              <Text className="admin-layout__eyebrow">Travels Away</Text>
              <Title level={3} className="admin-layout__page-title">
                {pageTitle}
              </Title>
            </div>
          </div>

          <div className="admin-layout__actions">
            <Input.Search
              allowClear
              placeholder="Search bookings, tours, users..."
              className="admin-layout__search"
            />

            <Badge count={4} size="small">
              <Button shape="circle" icon={<BellOutlined />} />
            </Badge>

            <Dropdown
              menu={{ items: profileItems, onClick: handleProfileMenuClick }}
              trigger={["click"]}
            >
              <Button className="admin-layout__profile">
                <Space>
                  <Avatar size={28} icon={<UserOutlined />} />
                  <span className="admin-layout__profile-name">Admin</span>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-layout__content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
