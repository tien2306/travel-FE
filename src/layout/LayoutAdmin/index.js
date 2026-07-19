import { Layout } from "antd";
import "./layoutAdmin.scss";
import {
  SearchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  EnvironmentOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Notify from "../../components/Common/Notify";
import MenuSider from "../../components/Admin/MenuSider";
import DarkModeToggle from "../../components/Common/DarkModeToggle";

const { Sider, Content } = Layout;

function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Layout className="layout-admin">
      <header className="header">
        <div
          className={
            "header__logo" + (collapsed ? " header__logo--collapsed" : "")
          }
        >
          <Link to="/">
            {collapsed ? (
              <>
                <HomeOutlined className="header__logo-icon" />
              </>
            ) : (
              <>
                <EnvironmentOutlined className="header__logo-icon" />
                <div className="header__logo-text">TravelAWay</div>
              </>
            )}
          </Link>
        </div>

        <div className="header__nav">
          <div className="header__nav-left">
            <div
              className="header__collapse"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </div>
            <div className="header__search">
              <SearchOutlined />
            </div>
          </div>
          <div className="header__nav-right">
            <DarkModeToggle />
            <Notify />
          </div>
        </div>
      </header>

      <Layout>
        <Sider
          theme="light"
          className="sider"
          width={200}
          collapsed={collapsed}
          // breakpoint="lg"
          // trigger={null}
          // collapsedWidth={0}
          // onCollapse={(value) => setCollapsed(value)}
        >
          <MenuSider />
        </Sider>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutAdmin;
