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

  // Hàm xử lý đóng menu
  const handleCloseMenu = () => {
    if (isMobile && setIsMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Hàm xử lý active chung cho NavLink độc lập
  const navLinkActive = (e) => {
    return e.isActive
      ? "header__nav-link header__nav-link--active"
      : "header__nav-link";
  };

  // Hàm xử lý active riêng cho các NavLink bọc Dropdown (vì cần giữ trạng thái active khi vào trang con)
  const getDropdownNavLinkClass = (prefixPath) => {
    return currentPath.startsWith(prefixPath)
      ? "header__nav-link header__nav-link--dropdown header__nav-link--active"
      : "header__nav-link header__nav-link--dropdown";
  };

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

      {/* SERVICE */}
      <Dropdown
        menu={{ items: serviceItems, onClick: handleCloseMenu }}
        trigger={["hover"]}
      >
        <NavLink
          to="/service" // Click thẳng vào Service sẽ ra trang tổng này
          className={getDropdownNavLinkClass("/service")}
          onClick={handleCloseMenu}
        >
          Service <DownOutlined style={{ fontSize: "10px" }} />
        </NavLink>
      </Dropdown>

      {/* PACKAGE */}
      <Dropdown
        menu={{ items: packageItems, onClick: handleCloseMenu }}
        trigger={["hover"]}
      >
        <NavLink
          to="/package" // Click thẳng vào Package sẽ ra trang tổng này
          className={getDropdownNavLinkClass("/package")}
          onClick={handleCloseMenu}
        >
          Package <DownOutlined style={{ fontSize: "10px" }} />
        </NavLink>
      </Dropdown>

      {/* BLOG */}
      <Dropdown
        menu={{ items: blogItems, onClick: handleCloseMenu }}
        trigger={["hover"]}
      >
        <NavLink
          to="/blog" // Click thẳng vào Blog sẽ ra trang tổng này
          className={getDropdownNavLinkClass("/blog")}
          onClick={handleCloseMenu}
        >
          Blog <DownOutlined style={{ fontSize: "10px" }} />
        </NavLink>
      </Dropdown>

      {/* PAGES */}
      <Dropdown
        menu={{ items: pageItems, onClick: handleCloseMenu }}
        trigger={isMobile ? ["hover"] : ["hover"]}
      >
        <NavLink
          to="/pages" // Click thẳng vào Pages sẽ ra trang tổng này
          className={getDropdownNavLinkClass("/pages")}
          onClick={handleCloseMenu}
        >
          Pages <DownOutlined style={{ fontSize: "10px" }} />
        </NavLink>
      </Dropdown>

      <NavLink
        to="/contact"
        className={navLinkActive}
        onClick={handleCloseMenu}
      >
        Contact
      </NavLink>

      {/* 3.Chỉ hiển thị nút Admin khi đang ở màn hình mobile VÀ user đăng nhập quyền ADMIN */}
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
