import { NavLink, useLocation, Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "./NavigationMenu.scss";

function NavigationMenu(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMobile, setIsMenuOpen } = props;
  const { t } = useTranslation("header");

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
    { key: "s1", label: <Link to="/service/services">{t("menu.travelServices")}</Link> },
    {
      key: "s2",
      label: <Link to="/service/service-detail">{t("menu.travelInsurance")}</Link>,
    },
  ];
  const packageItems = [
    { key: "p1", label: <Link to="/package/family">{t("menu.familyPackages")}</Link> },
    {
      key: "p2",
      label: <Link to="/package/honeymoon">{t("menu.honeymoonPackages")}</Link>,
    },
  ];
  const blogItems = [
    { key: "b1", label: <Link to="/blog/grid">{t("menu.blogGrid")}</Link> },
    { key: "b2", label: <Link to="/blog/detail">{t("menu.blogDetail")}</Link> },
  ];
  const pageItems = [
    { key: "pg1", label: <Link to="/pages/team">{t("menu.ourTeam")}</Link> },
    { key: "pg2", label: <Link to="/pages/testimonial">{t("menu.testimonial")}</Link> },
  ];

  return (
    <>
      <NavLink to="/" end className={navLinkActive} onClick={handleCloseMenu}>
        {t("menu.home")}
      </NavLink>
      <NavLink to="/about" className={navLinkActive} onClick={handleCloseMenu}>
        {t("menu.about")}
      </NavLink>

      {/* SERVICE */}
      {isMobile ? (
        <NavLink
          to="/service"
          className={navLinkActive}
          onClick={handleCloseMenu}
        >
          {t("menu.service")}
        </NavLink>
      ) : (
        <Dropdown
          menu={{ items: serviceItems, onClick: handleCloseMenu }}
          trigger={["hover"]}
          overlayClassName="nav-dropdown-overlay"
        >
          <NavLink
            to="/service"
            className={getDropdownNavLinkClass("/service")}
            onClick={handleCloseMenu}
          >
            {t("menu.service")} <DownOutlined style={{ fontSize: "10px" }} />
          </NavLink>
        </Dropdown>
      )}

      {/* PACKAGE */}
      {isMobile ? (
        <NavLink
          to="/package"
          className={navLinkActive}
          onClick={handleCloseMenu}
        >
          {t("menu.package")}
        </NavLink>
      ) : (
        <Dropdown
          menu={{ items: packageItems, onClick: handleCloseMenu }}
          trigger={["hover"]}
          overlayClassName="nav-dropdown-overlay"
        >
          <NavLink
            to="/package"
            className={getDropdownNavLinkClass("/package")}
            onClick={handleCloseMenu}
          >
            {t("menu.package")} <DownOutlined style={{ fontSize: "10px" }} />
          </NavLink>
        </Dropdown>
      )}

      {/* BLOG */}
      {isMobile ? (
        <NavLink
          to="/blog"
          className={navLinkActive}
          onClick={handleCloseMenu}
        >
          {t("menu.blog")}
        </NavLink>
      ) : (
        <Dropdown
          menu={{ items: blogItems, onClick: handleCloseMenu }}
          trigger={["hover"]}
          overlayClassName="nav-dropdown-overlay"
        >
          <NavLink
            to="/blog"
            className={getDropdownNavLinkClass("/blog")}
            onClick={handleCloseMenu}
          >
            {t("menu.blog")} <DownOutlined style={{ fontSize: "10px" }} />
          </NavLink>
        </Dropdown>
      )}

      {/* PAGES */}
      {isMobile ? (
        <NavLink
          to="/pages"
          className={navLinkActive}
          onClick={handleCloseMenu}
        >
          {t("menu.pages")}
        </NavLink>
      ) : (
        <Dropdown
          menu={{ items: pageItems, onClick: handleCloseMenu }}
          trigger={["hover"]}
          overlayClassName="nav-dropdown-overlay"
        >
          <NavLink
            to="/pages"
            className={getDropdownNavLinkClass("/pages")}
            onClick={handleCloseMenu}
          >
            {t("menu.pages")} <DownOutlined style={{ fontSize: "10px" }} />
          </NavLink>
        </Dropdown>
      )}

      <NavLink
        to="/contact"
        className={navLinkActive}
        onClick={handleCloseMenu}
      >
        {t("menu.contact")}
      </NavLink>

      {/* 3.Chỉ hiển thị nút Admin khi đang ở màn hình mobile VÀ user đăng nhập quyền ADMIN */}
      {isMobile && role === "ADMIN" && (
        <NavLink
          to="/admin"
          className={navLinkActive}
          onClick={handleCloseMenu}
        >
          {t("menu.admin")}
        </NavLink>
      )}
    </>
  );
}

export default NavigationMenu;
