import React from "react";
import { Drawer, Collapse } from "antd";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiLogIn,
  FiLogOut,
  FiHeart,
  FiMessageSquare,
  FiBell,
  FiSettings,
  FiLayout,
  FiCompass,
} from "react-icons/fi";
import NavigationMenu from "./NavigationMenu";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "./MobileDrawer.scss";

const MobileDrawer = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isLogin, role } = useSelector((state) => state.loginReducer);
  const { t } = useTranslation("header");

  return (
    <Drawer
      title={"Tài khoản"}
      placement="right"
      onClose={() => setIsMenuOpen(false)}
      open={isMenuOpen}
      width={280}
      rootClassName="header-mobile-drawer"
    >
      <div className="header__auth-mobile">
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
              <span className="mobile-nav-header-text">
                <FiCompass className="mobile-nav-header-icon" /> Điều
                hướng
              </span>
            }
            key="1"
          >
            <NavigationMenu setIsMenuOpen={setIsMenuOpen} isMobile={true} />
          </Collapse.Panel>
        </Collapse>
      </nav>
    </Drawer>
  );
};

export default MobileDrawer;
