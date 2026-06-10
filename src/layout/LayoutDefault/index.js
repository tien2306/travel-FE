import { Layout } from "antd";
import "./layoutDefaulat.scss";

import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import { Footer } from "antd/es/layout/layout";

const { Content } = Layout;

function LayoutDefault() {
  return (
    <Layout className="layout-default">
      <Header />

      <Layout>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>

      <Footer>footer</Footer>
    </Layout>
  );
}

export default LayoutDefault;
