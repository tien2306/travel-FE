import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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


// Dữ liệu tĩnh không cần dịch
const PAYMENTS = ["VISA", "Mastercard", "PayPal", "AMEX", "Discover", "JCB"];

const SOCIALS = [
  { id: "footer-fb", label: "Facebook", Icon: IconFacebook },
  { id: "footer-tw", label: "Twitter", Icon: IconTwitter },
  { id: "footer-ig", label: "Instagram", Icon: IconInstagram },
  { id: "footer-li", label: "LinkedIn", Icon: IconLinkedin },
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
              <IconCompass size={24} />
              <span>TravelAway</span>
            </div>
            <h4 className="footer-col-title">{t("contactTitle")}</h4>
            <div className="footer-contact-list">
              <a href="/" className="footer-contact-item">
                <IconMapPin size={16} />
                {t("address")}
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
            <h4 className="footer-col-title">{t("companyTitle")}</h4>
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
            <h4 className="footer-col-title">{t("supportTitle")}</h4>
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

          {/* ── Cột 4: Thanh toán ── */}
          <div>
            <h4 className="footer-col-title">{t("paymentsTitle")}</h4>
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
