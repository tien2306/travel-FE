import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "antd/es/layout/layout";
import "./layoutDefaulat.scss";

const { Content } = Layout;

function LayoutDefault() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");

  const isHomeBanner =
    location.pathname === "/" ||
    location.pathname === "/home" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const isAuthBanner =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "about") setPageTitle("About Us");
    else if (path === "service") setPageTitle("Our Services");
    else if (path === "blog") setPageTitle("Our Blog");
    else if (path === "contact") setPageTitle("Contact Us");
    else setPageTitle("");
  }, [location]);

  return (
    <Layout className="layout-default">
      <Header />

      <Layout>
        {/* header phụ*/}
        {!isHomeBanner && (
          <div className="sub-page-banner">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <h1 className="banner-title">{pageTitle}</h1>
              <p className="banner-breadcrumb">Home / Pages / {pageTitle}</p>
            </div>
          </div>
        )}

        <Content className="content">
          <Outlet />
        </Content>
      </Layout>

      {!isAuthBanner && <Footer>Footer</Footer>}
    </Layout>
  );
}

export default LayoutDefault;
