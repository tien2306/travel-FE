import React, { useState, useEffect } from "react";
import { Row, Col, Button, Drawer, Collapse } from "antd";
import Notify from "../../Common/Notify";
import "./header.scss";
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import {
  FiUser,
  FiLogIn,
  FiMapPin,
  FiLogOut,
  FiHeart,
  FiMessageSquare,
  FiBell,
  FiSettings,
  FiLayout,
  FiCompass,
} from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import NavigationMenu from "./NavigationMenu";
import DarkModeToggle from "../../Common/DarkModeToggle";
import GlobalSettings from "../../Common/GlobalSettings";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { isLogin, role } = useSelector((state) => state.loginReducer);
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
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" id="header-tw">
                  <FaTwitter className="header__social-icon" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" id="header-fb">
                  <FaFacebook className="header__social-icon" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" id="header-li">
                  <FaLinkedin className="header__social-icon" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" id="header-ig">
                  <FaInstagram className="header__social-icon" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" id="header-yt">
                  <FaYoutube className="header__social-icon" />
                </a>
              </div>
            </Col>

            <Col xs={0} lg={14} className="header__auth-col">
              <div className="header__auth">
                <GlobalSettings />

                {!isLogin ? (
                  <>
                    <Link className="header__auth-item" to="register">
                      <FiUser />
                      <span>{t("register")}</span>
                    </Link>
                    <Link className="header__auth-item" to="login">
                      <FiLogIn />
                      <span>{t("login")}</span>
                    </Link>
                  </>
                ) : (
                  <Notify />
                )}
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

            {/* Khối Hành động (Nút Book Now + Nút 3 gạch Mobile) */}
            <div className="header__right-actions">
              <div className="global-settings-wrapper--mobile">
                <GlobalSettings />
              </div>
              <DarkModeToggle />
              <Link
                type="primary"
                shape="round"
                size="large"
                className="header__btn-book"
              >
                {t("bookNow")}
              </Link>

              <Button
                type="text"
                className="header__btn-toggler"
                icon={<AiOutlineMenu />}
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
        title={"Tài khoản"}
        placement="right"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        width={280}
        rootClassName="header-mobile-drawer"
      >
        <div
          className="header__auth-mobile"
          style={{
            marginTop: 0,
            paddingTop: 0,
            borderTop: "none",
            borderBottom: "1px solid #eee",
            paddingBottom: "15px",
            marginBottom: "15px",
          }}
        >
          {isLogin ? (
            <div className="header__user-menu-mobile">
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <FiUser /> {t("notify.profile")}
              </Link>
              <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
                <FiHeart /> {t("notify.favorites")}
              </Link>
              <Link to="/inbox" onClick={() => setIsMenuOpen(false)}>
                <FiMessageSquare /> {t("notify.inbox")}
              </Link>
              <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
                <FiBell /> {t("notify.notifications")}
              </Link>
              <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                <FiSettings /> {t("notify.settings")}
              </Link>
              {role === "ADMIN" && (
               <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  <FiLayout /> {t("notify.admin")}
                </Link>
              )}
              <div className="header__auth-divider"></div>
              <Link
                to="/logout"
                onClick={() => setIsMenuOpen(false)}
                className="logout-link"
              >
                <FiLogOut /> {t("logout")}
              </Link>
            </div>
          ) : (
            <>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <FiUser /> {t("register")}
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <FiLogIn /> {t("login")}
              </Link>
            </>
          )}
        </div>

        <nav className="header__nav-mobile">
          <Collapse
            ghost
            expandIconPosition="end"
            className="mobile-nav-collapse"
          >
            <Collapse.Panel
              header={
                <span style={{ fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FiCompass style={{ fontSize: 18, color: '#6c757d' }} /> Điều hướng
                </span>
              }
              key="1"
            >
              <NavigationMenu setIsMenuOpen={setIsMenuOpen} isMobile={true} />
            </Collapse.Panel>
          </Collapse>
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
