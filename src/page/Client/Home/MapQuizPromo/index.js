import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./MapQuizPromo.scss";
import { useMapQuizAnimation } from "./animations";

export default function MapQuizPromo() {
  const sectionRef = useRef(null);

  useMapQuizAnimation(sectionRef);

  return (
    <div className="promo-wrapper" ref={sectionRef}>
      <Link to="/map" className="promo">
        <div className="promo__track">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="promo__group" key={i} aria-hidden={i > 1}>
              <span className="promo__text">CHINH PHỤC 34 TỈNH THÀNH</span>
              <span className="promo__text promo__text--separator">✦</span>
              <span className="promo__text promo__text--outline">
                GIẢI MÃ TỌA ĐỘ VN
              </span>
              <span className="promo__text promo__text--separator">✦</span>
              <span className="promo__text">BẠN LÀ PHƯỢT THỦ?</span>
              <span className="promo__text promo__text--separator">✦</span>
              <span className="promo__text promo__text--outline">
                BẤM CHƠI NGAY
              </span>
              <span className="promo__text promo__text--separator">✦</span>
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
