import React, { useState, useEffect } from "react";
import { Row, Col, Button, Drawer } from "antd";
import Notify from "../../Common/Notify";
import "./header.scss";
import {
  TwitterOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  UserOutlined,
  LoginOutlined,
  EnvironmentOutlined,
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import NavigationMenu from "../NavigationMenu";
import DarkModeToggle from "../../Common/DarkModeToggle";
import GlobalSettings from "../GlobalSettings";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { isLogin } = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation("header");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

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
                <Link to="/">
                  <TwitterOutlined className="header__social-icon" />
                </Link>
                <Link to="/">
                  <FacebookOutlined className="header__social-icon" />
                </Link>
                <Link to="/">
                  <LinkedinOutlined className="header__social-icon" />
                </Link>
                <Link to="/">
                  <InstagramOutlined className="header__social-icon" />
                </Link>
                <Link to="/">
                  <YoutubeOutlined className="header__social-icon" />
                </Link>
              </div>
            </Col>
            <Col xs={0} lg={14} className="header__auth-col">
              <div className="header__auth">
                {!isLogin && (
                  <>
                    <Link className="header__auth-item" to="register">
                      <UserOutlined />
                      <span>{t('register')}</span>
                    </Link>
                    <Link className="header__auth-item" to="login">
                      <LoginOutlined />
                      <span>{t('login')}</span>
                    </Link>
                  </>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GlobalSettings />
                  <Notify />
                </div>
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
                <EnvironmentOutlined className="header__logo-icon" />
                <div className="header__logo-text">TravelAWay</div>
              </Link>
            </div>

            {/* Khối Điều hướng Ngang  */}
            <nav className="header__nav">
              <NavigationMenu isMobile={false} />
            </nav>

            {/* Khối Hành động (Nút Book Now + Nút 3 gạch Mobile) */}
            <div className="header__right-actions">
              <div className="header__global-settings-mobile">
                <GlobalSettings />
              </div>
              <DarkModeToggle />
              <Link
                type="primary"
                shape="round"
                size="large"
                className="header__btn-book"
              >
                {t('bookNow')}
              </Link>

              <Button
                type="text"
                className="header__btn-toggler"
                icon={<MenuOutlined />}
                onClick={() => setIsMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {/* được dùng để hiển thị một bảng 
      điều khiển trượt từ các cạnh của màn hình  */}
      <Drawer
        title="Menu Điều Hướng"
        placement="right"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        width={280}
      >
        <nav className="header__nav-mobile">
          <NavigationMenu setIsMenuOpen={setIsMenuOpen} isMobile={true} />
          <div className="header__auth-mobile">
            {isLogin ? (
              <Link to="/logout" onClick={() => setIsMenuOpen(false)}>
                <LogoutOutlined /> {t('logout')}
              </Link>
            ) : (
              <>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <UserOutlined /> {t('register')}
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <LoginOutlined /> {t('login')}
                </Link>
              </>
            )}
          </div>
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
