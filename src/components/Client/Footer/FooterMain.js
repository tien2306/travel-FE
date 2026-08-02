import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiCompass,
  FiMapPin,
  FiMail,
  FiPhone,
  FiPrinter,
  FiChevronRight,
  FiShare2,
} from "react-icons/fi";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaCcDiscover,
  FaCcJcb,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

// Dữ liệu tĩnh không cần dịch
const PAYMENTS = [
  { id: "visa", label: "VISA", Icon: FaCcVisa },
  { id: "mastercard", label: "Mastercard", Icon: FaCcMastercard },
  { id: "paypal", label: "PayPal", Icon: FaCcPaypal },
  { id: "amex", label: "AMEX", Icon: FaCcAmex },
  { id: "discover", label: "Discover", Icon: FaCcDiscover },
  { id: "jcb", label: "JCB", Icon: FaCcJcb },
];

const SOCIALS = [
  { id: "footer-fb", label: "Facebook", Icon: FaFacebook, href: "https://facebook.com" },
  { id: "footer-tw", label: "Twitter", Icon: FaTwitter, href: "https://twitter.com" },
  { id: "footer-ig", label: "Instagram", Icon: FaInstagram, href: "https://instagram.com" },
  { id: "footer-li", label: "LinkedIn", Icon: FaLinkedin, href: "https://linkedin.com" },
];

// ─── Footer Main ─────────────────────────────────────────────
function FooterMain() {
  const { t } = useTranslation("footer");

  const COMPANY_LINKS = [
    { label: t("links.aboutUs"), to: "/about" },
    { label: t("links.careers"), to: "/" },
    { label: t("links.blog"), to: "/blog" },
    { label: t("links.press"), to: "/" },
    { label: t("links.giftCards"), to: "/" },
    { label: t("links.magazine"), to: "/" },
  ];

  const SUPPORT_LINKS = [
    { label: t("links.contact"), to: "/contact" },
    { label: t("links.legalNotice"), to: "/" },
    { label: t("links.privacyPolicy"), to: "/" },
    { label: t("links.terms"), to: "/" },
    { label: t("links.sitemap"), to: "/" },
    { label: t("links.cookie"), to: "/" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* ── Cột 1: Liên hệ ── */}
          <div>
            <div className="footer-brand">
              <FiCompass size={24} />
              <span>TravelAway</span>
            </div>
            <h4 className="footer-col-title">{t("contactTitle")}</h4>
            <div className="footer-contact-list">
              <a href="/" className="footer-contact-item">
                <FiMapPin size={16} />
                {t("address")}
              </a>
              <a href="mailto:info@travelgo.vn" className="footer-contact-item">
                <FiMail size={16} />
                info@TravelAway.vn
              </a>
              <a href="tel:+84283822988" className="footer-contact-item">
                <FiPhone size={16} />
                +84 28 3822 9988
              </a>
              <a href="tel:+84283822989" className="footer-contact-item">
                <FiPrinter size={16} />
                +84 28 3822 9989
              </a>
            </div>

            <div className="footer-socials">
              <FiShare2 size={18} className="footer-socials__icon" />
              {SOCIALS.map(({ id, label, Icon, href }) => (
                <a
                  key={id}
                  href={href}
                  id={id}
                  target="_blank"
                  rel="noopener noreferrer"
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
            <h4 className="footer-col-title">{t("companyTitle")}</h4>
            <nav className="footer-link-list">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="footer-link-item"
                >
                  <FiChevronRight size={14} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Cột 3: Support ── */}
          <div>
            <h4 className="footer-col-title">{t("supportTitle")}</h4>
            <nav className="footer-link-list">
              {SUPPORT_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="footer-link-item"
                >
                  <FiChevronRight size={14} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Cột 4: Thanh toán ── */}
          <div>
            <h4 className="footer-col-title">{t("paymentsTitle")}</h4>
            <div className="footer-payments">
              {PAYMENTS.map(({ id, label, Icon }) => (
                <a href="/" key={id} id={`pay-${id}`} className="payment-badge" aria-label={label} title={label}>
                  <Icon size={32} />
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
            &copy; {new Date().getFullYear()} <a href="/">TravelAway</a>.{" "}
            {t("copyright.rights")}
          </p>
          <p className="footer-copyright-text">
            {t("copyright.designedBy")} <a href="/">TravelAway Team</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterMain;
