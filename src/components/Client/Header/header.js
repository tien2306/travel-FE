import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Button } from "antd";
import Notify from "../../Common/Notify";
import "./header.scss";
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FiUser, FiLogIn, FiMapPin } from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import NavigationMenu from "./NavigationMenu";
import MobileDrawer from "./MobileDrawer";
import DarkModeToggle from "../../Common/DarkModeToggle";
import GlobalSettings from "../../Common/GlobalSettings";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useScroll } from "../../../hooks/useScroll";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const { isLogin, loading, user } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation("header");

  const scrollY = useScroll();

  // Cập nhật trạng thái sticky khi scrollY thay đổi
  useEffect(() => {
    setIsSticky(scrollY >= 60);
  }, [scrollY, dispatch]);

  // Dùng useCallback cho hàm đóng/mở menu để tránh tạo lại hàm khi re-render
  const handleOpenMenu = useCallback(() => setIsMenuOpen(true), []);
  const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

  // Dùng useMemo để gom cụm logic render Auth nhằm tăng độ đọc hiểu và hiệu năng
  const renderAuthContent = useMemo(() => {
    if (loading || (isLogin && !user)) {
      return (
        <div className="header__auth-loading-wrapper">
          <div className="header__auth-loading-spinner"></div>
        </div>
      );
    }

    if (!isLogin) {
      return (
        <>
          <Link className="header__auth-item" to="/register">
            <FiUser />
            <span>{t("register")}</span>
          </Link>
          <Link className="header__auth-item" to="/login">
            <FiLogIn />
            <span>{t("login")}</span>
          </Link>
        </>
      );
    }

    return <Notify />;
  }, [loading, isLogin, user, t]);

  return (
    <header className={`header ${isSticky ? "header--sticky" : ""}`}>
      {/* TOPBAR */}
      <div className="header__topbar">
        <div className="header__container">
          <Row
            align="middle"
            justify="space-between"
            className="header__row-topbar"
          >
            <Col xs={0} lg={10} className="header__socials-col">
              <div className="header__socials">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="header-tw"
                >
                  <FaTwitter className="header__social-icon" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="header-fb"
                >
                  <FaFacebook className="header__social-icon" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="header-li"
                >
                  <FaLinkedin className="header__social-icon" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="header-ig"
                >
                  <FaInstagram className="header__social-icon" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="header-yt"
                >
                  <FaYoutube className="header__social-icon" />
                </a>
              </div>
            </Col>

            <Col xs={0} lg={14} className="header__auth-col">
              <div className="header__auth">
                <GlobalSettings />
                {renderAuthContent}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* MAINBAR */}
      <div className="header__mainbar">
        <div className="header__container">
          <div className="header__mainbar-wrapper">
            {/* Khối Logo */}
            <div className="header__logo">
              <Link to="/">
                <FiMapPin className="header__logo-icon" />
                <div className="header__logo-text">TravelAWay</div>
              </Link>
            </div>

            {/* Khối Điều hướng Ngang  */}
            <nav className="header__nav">
              <NavigationMenu isMobile={false} />
            </nav>

            {/* Khối Hành động */}
            <div className="header__right-actions">
              <div className="global-settings-wrapper--mobile">
                <GlobalSettings />
              </div>
              <DarkModeToggle />

              <Link className="header__btn-book">
                {t("bookNow")}
                <Button
                  type="text"
                  className="header__btn-toggler"
                  icon={<AiOutlineMenu />}
                  onClick={handleOpenMenu}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <MobileDrawer isMenuOpen={isMenuOpen} setIsMenuOpen={handleCloseMenu} />
    </header>
  );
};

export default Header;
