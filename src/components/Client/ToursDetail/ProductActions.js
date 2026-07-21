import React from "react";
import "./ProductActions.scss";

const ProductActions = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="product-actions">
      <button className="action-btn">
        <span className="icon">♡</span> Yêu thích
      </button>
      <button className="action-btn" onClick={() => scrollToSection("tour-qa")}>
        <span className="icon">💬</span> Hỏi đáp
      </button>
      <button className="action-btn" onClick={() => scrollToSection("tour-reviews")}>
        <span className="icon">⭐</span> Đánh giá
      </button>
    </div>
  );
};

export default ProductActions;
