import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import "./layoutDefaulat.scss";
import { getCarouselUser } from "../../services/carousel";
import Header from "../../components/Client/Header/header";
import Footer from "../../components/Client/Footer";
import { getRandomBannerImage } from "../../helpers/ui/banner";
import fallbackImage from "../../assets/images/fallbackImage.jpg";

const { Content } = Layout;

function LayoutDefault() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState(""); // state lưu tên page
  const [carouselData, setCarouselData] = useState([]); // state lưu data carousel
  const [currentBg, setCurrentBg] = useState(fallbackImage); // State lưu ảnh hiện tại

  // Trang Home
  const isHomeBanner =
    location.pathname === "/" ||
    location.pathname === "/home" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Footer Trang login register
  const isFooterBanner =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.includes("map");

  // Lấy data ảnh carousel
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await getCarouselUser();
        if (res && res.success && res.data.length > 0) {
          setCarouselData(res.data);
        }
      } catch (error) {
        console.error("Lỗi gọi API Carousel:", error);
      }
    };
    fetchCarousel();
  }, []);

  // Thay đổi khi pathname thay đổi
  // http://localhost:5173/products/123?sort=asc
  // pathname là đường dẫn thuần túy của url: /products/123
  // không tính phần tên miền, cổng (localhost)
  // tham số tìm kiếm (?search=abc)
  // hay mã định danh (#hash).
  useEffect(() => {
    setCurrentBg(getRandomBannerImage(carouselData));
  }, [location.pathname, carouselData]);

  // Tự động cập nhật tiêu đề (Page Title)
  useEffect(() => {
    const currentPath = location.pathname.toLowerCase();

    if (currentPath.includes("about")) setPageTitle("About Us");
    else if (currentPath.includes("service")) setPageTitle("Our Services");
    else if (currentPath.includes("blog")) setPageTitle("Our Blog");
    else if (currentPath.includes("contact")) setPageTitle("Contact Us");
    else if (currentPath.includes("package")) setPageTitle("Package Us");
    else if (currentPath.includes("pages")) setPageTitle("Pages Us");
    else if (location.pathname.match(/^\/tours\/[^/]+$/))
      setPageTitle("Tour Detail");
    else if (currentPath.includes("tours")) setPageTitle("Us Tour");
    else if (currentPath.includes("favorites")) setPageTitle("Favorites");
    else if (currentPath.includes("profile")) setPageTitle("User Profile");
    else if (currentPath.includes("map")) setPageTitle("Discovery Quiz");
    else setPageTitle("");
  }, [location.pathname]);

  return (
    <Layout className="layout-default">
      <Header />

      <Layout>
        {/* Nếu KHÔNG PHẢI trang chủ/đăng nhập/đăng ký -> Hiển thị sub-page-banner phụ */}
        {!isHomeBanner && (
          <div
            className="sub-page-banner"
            style={{ backgroundImage: `url(${currentBg})` }}
          >
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <h1 className="banner-title">{pageTitle}</h1>
              <p className="banner-breadcrumb">Home / Pages / {pageTitle}</p>
            </div>
          </div>
        )}

        <Content className="content">
          <Outlet context={{ carouselData, defaultBgFromApi: currentBg }} />
        </Content>
      </Layout>

      {/* Nếu KHÔNG PHẢI trang đăng nhập/đăng ký -> Hiển thị Footer */}
      {!isFooterBanner && <Footer />}
    </Layout>
  );
}

export default LayoutDefault;
