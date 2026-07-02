import { NavLink, useLocation, Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

function NavigationMenu(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMobile, setIsMenuOpen } = props;

  // console.log(props);

  const navLinkActive = (e) => {
    return e.isActive
      ? "header__nav-link header__nav-link--active"
      : "header__nav-link";
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
      <NavLink
        to="/"
        end
        className={navLinkActive}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={navLinkActive}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        About
      </NavLink>

      <Dropdown
        menu={{ items: serviceItems }}
        trigger={isMobile ? ["click"] : ["hover"]}
      >
        <span
          className={`header__nav-link header__nav-link--dropdown ${currentPath.startsWith("/service") ? "header__nav-link--active" : ""}`}
        >
          Service <DownOutlined style={{ fontSize: "10px" }} />
        </span>
      </Dropdown>

      <Dropdown
        menu={{ items: packageItems }}
        trigger={isMobile ? ["click"] : ["hover"]}
      >
        <span
          className={`header__nav-link header__nav-link--dropdown ${currentPath.startsWith("/package") ? "header__nav-link--active" : ""}`}
        >
          Package <DownOutlined style={{ fontSize: "10px" }} />
        </span>
      </Dropdown>

      <Dropdown
        menu={{ items: blogItems }}
        trigger={isMobile ? ["click"] : ["hover"]}
      >
        <span
          className={`header__nav-link header__nav-link--dropdown ${currentPath.startsWith("/blog") ? "header__nav-link--active" : ""}`}
        >
          Blog <DownOutlined style={{ fontSize: "10px" }} />
        </span>
      </Dropdown>

      <Dropdown
        menu={{ items: pageItems }}
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
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        Contact
      </NavLink>
    </>
  );
}

export default NavigationMenu;
