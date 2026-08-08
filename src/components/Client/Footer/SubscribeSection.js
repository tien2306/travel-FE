import { useState } from "react";
import "./SubscribeSection.scss";
import { Input, Button } from "antd";
import { useTranslation } from "react-i18next";

// ─── Subscribe Section ────────────────────────────────────────
function SubscribeSection() {
  const [email, setEmail] = useState("");
  const { t } = useTranslation("footer");

  const handleSubscribe = () => {
    if (email.trim()) setEmail("");
  };

  return (
    <div className="subscribe-section">
      <div className="subscribe-inner">
        <p className="subscribe-label">{t("subscribe.label")}</p>
        <h2 className="subscribe-title">{t("subscribe.title")}</h2>
        <p className="subscribe-desc">
          {t("subscribe.desc")}
        </p>
        <div className="subscribe-form">
          <Input
            id="subscribe-email-input"
            type="email"
            placeholder={t("subscribe.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onPressEnter={handleSubscribe}
          />
          <Button
            id="subscribe-submit-btn"
            type="primary"
            className="subscribe-btn"
            onClick={handleSubscribe}
          >
            {t("subscribe.button")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SubscribeSection;
