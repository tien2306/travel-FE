import React from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatDate } from "../../../helpers/fomatDate";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UsergroupAddOutlined, 
  FireOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./ProductInfo.scss";

const ProductInfo = ({ tour }) => {
  const availableSlots = (tour.quantity || 0) - (tour.sold || 0);
  const isAvailable = availableSlots > 0 && tour.status === "ACTIVE";
  const { t } = useTranslation("tours");

  return (
    <div className="product-info">
      <h1 className="product-name">{tour.name}</h1>
      
      <div className="product-price-box">
        <span className="current-price">{formatPrice(tour.price)}</span>
      </div>

      {tour.shortDesc && (
        <div className="product-short-desc">
          <p>{tour.shortDesc}</p>
        </div>
      )}

      <div className="product-variants">
        <div className="variant-item">
          <CalendarOutlined className="v-icon" />
          <div className="v-text">
            <span>{t("detail.duration")}</span>
            <strong>{formatDate(tour.startDate)} - {formatDate(tour.endDate)}</strong>
          </div>
        </div>
        <div className="variant-item">
          <EnvironmentOutlined className="v-icon" />
          <div className="v-text">
            <span>{t("detail.journey")}</span>
            <strong>{tour.departurePlace || "..."} ➔ {tour.destination || "..."}</strong>
          </div>
        </div>
        <div className="variant-item">
          <UsergroupAddOutlined className="v-icon" />
          <div className="v-text">
            <span>{t("detail.status")}</span>
            <strong>{isAvailable ? t("detail.slotsAvailable", { count: availableSlots }) : t("detail.fullyBooked")}</strong>
          </div>
        </div>
        <div className="variant-item">
          <FireOutlined className="v-icon" />
          <div className="v-text">
            <span>{t("detail.sold")}</span>
            <strong>{tour.sold || 0} {t("detail.guests")}</strong>
          </div>
        </div>
      </div>

      <div className="product-booking">
        {isAvailable ? (
          <Link to={`/checkout/${tour.id}`} className="btn-buy-now">
            <strong>{t("detail.bookNow")}</strong>
            <span>{t("detail.bookSub")}</span>
          </Link>
        ) : (
          <button className="btn-buy-now disabled" disabled>
            <strong>{t("detail.fullyBookedBtn")}</strong>
            <span>{t("detail.contactSub")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
