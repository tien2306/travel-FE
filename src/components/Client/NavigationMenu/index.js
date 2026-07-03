import { NavLink, useLocation, Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
// 1. Nhập useSelector để lấy quyền từ Redux
import { useSelector } from "react-redux";

function NavigationMenu(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMobile, setIsMenuOpen } = props;

  // 2. Lấy thông tin role từ loginReducer (Đã xóa isLogin thừa để hết lỗi)
  const state = useSelector((state) => state.loginReducer);
  const role = state?.role;

  // Hàm xử lý đóng menu trượt khi người dùng click chọn link (chỉ chạy trên thiết bị di động)
  const handleCloseMenu = () => {
    if (isMobile && setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const navLinkActive = (e) => {
    return e.isActive
      ? "header__nav-link header__nav-link--active"
      : "header__nav-link";
  };

  // Giữ nguyên toàn bộ cấu hình mảng dữ liệu menu con của bạn
  const serviceItems = [
    { key: "s1", label: <Link to="/service/services">Travel Services</Link> },
    {
      key: "s2",
      label: <Link to="/service/service-detail">Travel Insurance</Link>,
    },
  ];
  const packageItems = [
    { key: "p1", label: <Link to="/package/family">Family Packages</Link> },
    {
      key: "p2",
      label: <Link to="/package/honeymoon">Honeymoon Packages</Link>,
    },
  ];
  const blogItems = [
    { key: "b1", label: <Link to="/blog/grid">Blog Grid</Link> },
    { key: "b2", label: <Link to="/blog/detail">Blog Detail</Link> },
  ];
  const pageItems = [
    { key: "pg1", label: <Link to="/pages/team">Our Team</Link> },
    { key: "pg2", label: <Link to="/pages/testimonial">Testimonial</Link> },
  ];

  return (
    <>
      <NavLink to="/" end className={navLinkActive} onClick={handleCloseMenu}>
        Home
      </NavLink>
      <NavLink to="/about" className={navLinkActive} onClick={handleCloseMenu}>
        About
      </NavLink>

      <Dropdown
        menu={{ items: serviceItems, onClick: handleCloseMenu }}
        trigger={isMobile ? ["click"] : ["hover"]}
      >
        <span
          className={`header__nav-link header__nav-link--dropdown ${currentPath.startsWith("/service") ? "header__nav-link--active" : ""}`}
        >
          Service <DownOutlined style={{ fontSize: "10px" }} />
        </span>
      </Dropdown>

      <Dropdown
        menu={{ items: packageItems, onClick: handleCloseMenu }}
        trigger={isMobile ? ["click"] : ["hover"]}
      >
        <span
          className={`header__nav-link header__nav-link--dropdown ${currentPath.startsWith("/package") ? "header__nav-link--active" : ""}`}
        >
          Package <DownOutlined style={{ fontSize: "10px" }} />
        </span>
      </Dropdown>

      <Dropdown
        menu={{ items: blogItems, onClick: handleCloseMenu }}
        trigger={isMobile ? ["click"] : ["hover"]}
      >
        <span
          className={`header__nav-link header__nav-link--dropdown ${currentPath.startsWith("/blog") ? "header__nav-link--active" : ""}`}
        >
          Blog <DownOutlined style={{ fontSize: "10px" }} />
        </span>
      </Dropdown>

      <Dropdown
        menu={{ items: pageItems, onClick: handleCloseMenu }}
        trigger={isMobile ? ["click"] : ["hover"]}
      >
        <span
          className={`header__nav-link header__nav-link--dropdown ${currentPath.startsWith("/pages") ? "header__nav-link--active" : ""}`}
        >
          Pages <DownOutlined style={{ fontSize: "10px" }} />
        </span>
      </Dropdown>

      <NavLink
        to="/contact"
        className={navLinkActive}
        onClick={handleCloseMenu}
      >
        Contact
      </NavLink>

      {/* 3. ĐIỀU KIỆN CHO MÀN HÌNH NHỎ: Chỉ hiển thị nút Admin khi đang ở màn hình mobile (isMobile) VÀ user đăng nhập quyền ADMIN */}
      {isMobile && role === "ADMIN" && (
        <NavLink
          to="/admin"
          className={navLinkActive}
          onClick={handleCloseMenu}
        >
          Admin
        </NavLink>
      )}
    </>
  );
}

export default NavigationMenu;
