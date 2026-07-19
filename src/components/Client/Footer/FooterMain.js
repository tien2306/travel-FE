import { Select } from "antd";
import { Link } from "react-router-dom";
import {
  IconCompass,
  IconMapPin,
  IconMail,
  IconPhone,
  IconPrint,
  IconChevronRight,
  IconShare,
  IconFacebook,
  IconTwitter,
  IconInstagram,
  IconLinkedin,
} from "../../Common/Icons";

const { Option } = Select;

// ─── Dữ liệu ─────────────────────────────────────────────────
const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/" },
  { label: "Blog", to: "/blog" },
  { label: "Press", to: "/" },
  { label: "Gift Cards", to: "/" },
  { label: "Magazine", to: "/" },
];

const SUPPORT_LINKS = [
  { label: "Contact", to: "/contact" },
  { label: "Legal Notice", to: "/" },
  { label: "Privacy Policy", to: "/" },
  { label: "Terms & Conditions", to: "/" },
  { label: "Sitemap", to: "/" },
  { label: "Cookie Policy", to: "/" },
];

const PAYMENTS = ["VISA", "Mastercard", "PayPal", "AMEX", "Discover", "JCB"];

const SOCIALS = [
  { id: "footer-fb", label: "Facebook", Icon: IconFacebook },
  { id: "footer-tw", label: "Twitter", Icon: IconTwitter },
  { id: "footer-ig", label: "Instagram", Icon: IconInstagram },
  { id: "footer-li", label: "LinkedIn", Icon: IconLinkedin },
];

// ─── Footer Main ─────────────────────────────────────────────
function FooterMain() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* ── Cột 1: Liên hệ ── */}
          <div>
            <div className="footer-brand">
              <IconCompass size={24} />
              <span>TravelAway</span>
            </div>
            <h4 className="footer-col-title">Liên hệ</h4>
            <div className="footer-contact-list">
              <a href="/" className="footer-contact-item">
                <IconMapPin size={16} />
                132 Nguyễn Đình Chiểu, Q.3, TP.HCM
              </a>
              <a href="mailto:info@travelgo.vn" className="footer-contact-item">
                <IconMail size={16} />
                info@TravelAway.vn
              </a>
              <a href="tel:+84283822988" className="footer-contact-item">
                <IconPhone size={16} />
                +84 28 3822 9988
              </a>
              <a href="tel:+84283822989" className="footer-contact-item">
                <IconPrint size={16} />
                +84 28 3822 9989
              </a>
            </div>

            <div className="footer-socials">
              <IconShare size={18} className="footer-socials__icon" />
              {SOCIALS.map(({ id, label, Icon }) => (
                <a
                  key={id}
                  href="/"
                  id={id}
                  className="footer-social-btn"
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Cột 2: Company ── */}
          <div>
            <h4 className="footer-col-title">Company</h4>
            <nav className="footer-link-list">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="footer-link-item"
                >
                  <IconChevronRight size={14} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Cột 3: Support ── */}
          <div>
            <h4 className="footer-col-title">Support</h4>
            <nav className="footer-link-list">
              {SUPPORT_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="footer-link-item"
                >
                  <IconChevronRight size={14} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Cột 4: Cài đặt + Thanh toán ── */}
          <div>
            <h4 className="footer-col-title">Cài đặt</h4>

            <div className="footer-selects">
              <Select
                id="footer-language-select"
                defaultValue="vi"
                style={{ width: "100%" }}
                popupMatchSelectWidth={false}
              >
                <Option value="vi">Tiếng Việt</Option>
                <Option value="en">English</Option>
                <Option value="zh">中文</Option>
                <Option value="ko">한국어</Option>
              </Select>
              <Select
                id="footer-currency-select"
                defaultValue="vnd"
                style={{ width: "100%" }}
                popupMatchSelectWidth={false}
              >
                <Option value="vnd">₫ VND</Option>
                <Option value="usd">$ USD</Option>
                <Option value="eur">€ EUR</Option>
                <Option value="gbp">£ GBP</Option>
              </Select>
            </div>

            <p className="footer-payments-title">Thanh toán</p>
            <div className="footer-payments">
              {PAYMENTS.map((p) => (
                <a href="/" key={p} className="payment-badge" aria-label={p}>
                  {p}
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="footer-divider" />
      </div>

      {/* ── Copyright ── */}
      <div className="footer-copyright">
        <div className="footer-copyright-inner">
          <p className="footer-copyright-text">
            &copy; {new Date().getFullYear()} <a href="/">TravelAway</a>. All
            rights reserved.
          </p>
          <p className="footer-copyright-text">
            Designed by <a href="/">TravelAway Team</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterMain;
