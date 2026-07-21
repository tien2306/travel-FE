import React from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatDate } from "../../../helpers/fomatDate";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UsergroupAddOutlined, 
  FireOutlined
} from "@ant-design/icons";
import "./ProductInfo.scss";

const ProductInfo = ({ tour }) => {
  const availableSlots = (tour.quantity || 0) - (tour.sold || 0);
  const isAvailable = availableSlots > 0 && tour.status === "ACTIVE";

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
            <span>Thời gian</span>
            <strong>{formatDate(tour.startDate)} - {formatDate(tour.endDate)}</strong>
          </div>
        </div>
        <div className="variant-item">
          <EnvironmentOutlined className="v-icon" />
          <div className="v-text">
            <span>Hành trình</span>
            <strong>{tour.departurePlace || "..."} ➔ {tour.destination || "..."}</strong>
          </div>
        </div>
        <div className="variant-item">
          <UsergroupAddOutlined className="v-icon" />
          <div className="v-text">
            <span>Tình trạng</span>
            <strong>{isAvailable ? `Còn ${availableSlots} chỗ` : "Tạm hết chỗ"}</strong>
          </div>
        </div>
        <div className="variant-item">
          <FireOutlined className="v-icon" />
          <div className="v-text">
            <span>Đã bán</span>
            <strong>{tour.sold || 0} khách</strong>
          </div>
        </div>
      </div>

      <div className="product-booking">
        {isAvailable ? (
          <Link to={`/checkout/${tour.id}`} className="btn-buy-now">
            <strong>ĐẶT TOUR NGAY</strong>
            <span>Giữ chỗ tức thời - Thanh toán an toàn</span>
          </Link>
        ) : (
          <button className="btn-buy-now disabled" disabled>
            <strong>TẠM HẾT CHỖ</strong>
            <span>Vui lòng liên hệ để biết thêm chi tiết</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
