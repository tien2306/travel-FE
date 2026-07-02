import { useEffect, useState, useMemo } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "antd/es/layout/layout";
import "./layoutDefaulat.scss";
import { getCarousel } from "../../services/carouselService";

const { Content } = Layout;

function LayoutDefault() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  // Khai báo state lưu danh sách ảnh từ API Carousel
  const [carouselData, setCarouselData] = useState([]);

  // Gọi API lấy dữ liệu Carousel
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await getCarousel();
        if (res && res.success && res.data.length > 0) {
          setCarouselData(res.data);
        }
      } catch (error) {
        console.error("Lỗi gọi API Carousel:", error);
      }
    };
    fetchCarousel();
  }, []);

  // UseMemo sẽ tính toán và KHÓA CHẶT ảnh nền lại, chỉ tính lại duy nhất khi location.pathname thay đổi.
  const currentBg = useMemo(() => {
    // Nếu API chưa trả về data, dùng tạm ảnh tĩnh dự phòng
    if (!carouselData || carouselData.length === 0) {
      return "../../images/carousel-1.jpg";
    }

    // Tạo số ngẫu nhiên dựa vào chính độ dài mảng
    const randomIndex = Math.floor(Math.random() * carouselData.length);
    return carouselData[randomIndex]?.image || "../../images/carousel-1.jpg";

    // Chỉ tính toán lại khi người dùng bấm chuyển trang (location.pathname thay đổi)
  }, [location.pathname, carouselData.length]);

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
        {/* header phụ */}
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
          {/* Truyền dữ liệu an toàn xuống các component con */}
          <Outlet context={{ carouselData, defaultBgFromApi: currentBg }} />
        </Content>
      </Layout>

      {!isAuthBanner && <Footer>Footer</Footer>}
    </Layout>
  );
}

export default LayoutDefault;
