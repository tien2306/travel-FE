import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";

import "./layoutDefaulat.scss";
import { getCarouselUser } from "../../services/carouselService";
import Header from "../../components/Client/Header";
import { IMAGE_URLS } from "../../constants/api";

const { Content } = Layout;

function LayoutDefault() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const [carouselData, setCarouselData] = useState([]);

  // State lưu ảnh hiện tại
  const [currentBg, setCurrentBg] = useState("../../images/carousel-1.jpg");

  // API lấy dữ liệu Carousel khi trang web được tải lần đầu
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await getCarouselUser();
        // console.log(res);
        if (res && res.success && res.data.length > 0) {
          setCarouselData(res.data);
        }
      } catch (error) {
        console.error("Lỗi gọi API Carousel:", error);
      }
    };
    fetchCarousel();
  }, []);

  // 2. THEO DÕI CHUYỂN TRANG: Mỗi lần URL thay đổi, tự động bốc ngẫu nhiên một ảnh khác
  useEffect(() => {
    if (carouselData && carouselData.length > 0) {
      const randomIndex = Math.floor(Math.random() * carouselData.length);
      // setCurrentBg(
      //   carouselData[randomIndex]?.image || "../../images/carousel-1.jpg",
      // );

      const apiImageName = carouselData[randomIndex]?.image;
      if (apiImageName) {
        setCurrentBg(
          `${IMAGE_URLS.HERO_CAROUSEL}${apiImageName.trim()}`,
        );
      } else {
        setCurrentBg("../../images/carousel-1.jpg");
      }
    }
  }, [location.pathname, carouselData]);

  // Kiểm tra xem trang hiện tại có cần ẩn sub-page-banner phụ không
  const isHomeBanner =
    location.pathname === "/" ||
    location.pathname === "/home" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/tours";

  // Kiểm tra xem trang hiện tại có phải trang đăng nhập/đăng ký để ẩn footer không
  const isAuthBanner =
    location.pathname === "/login" || location.pathname === "/register";

  // Tự động cập nhật tiêu đề (Page Title) dựa theo đường dẫn URL hiện tại
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "about") setPageTitle("About Us");
    else if (path === "service") setPageTitle("Our Services");
    else if (path === "blog") setPageTitle("Our Blog");
    else if (path === "contact") setPageTitle("Contact Us");
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
      {!isAuthBanner && <footer>Footer</footer>}
    </Layout>
  );
}

export default LayoutDefault;
