import { useState } from "react";
import { Input, Button } from "antd";

// ─── Subscribe Section ────────────────────────────────────────
function SubscribeSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email.trim()) setEmail("");
  };

  return (
    <div className="subscribe-section">
      <div className="subscribe-inner">
        <p className="subscribe-label">Subscribe</p>
        <h2 className="subscribe-title">Our Newsletter</h2>
        <p className="subscribe-desc">
          Đăng ký để nhận những ưu đãi tour độc quyền, cẩm nang du lịch và tin tức mới nhất từ TravelGo ngay trong hộp thư của bạn.
        </p>
        <div className="subscribe-form">
          <Input
            id="subscribe-email-input"
            type="email"
            placeholder="Nhập địa chỉ email của bạn"
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
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SubscribeSection;
