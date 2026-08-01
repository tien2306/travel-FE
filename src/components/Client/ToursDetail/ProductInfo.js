import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { formatPrice, formatDate } from "../../../helpers/formatDate";
import {
  getFavoriteStatus,
  addFavorite,
  removeFavorite,
} from "../../../services/favorite";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UsergroupAddOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HeartOutlined,
  HeartFilled,
  CarOutlined,
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import "./ProductInfo.scss";

const ProductInfo = ({ tour }) => {
  // console.log(tour);
  const { t } = useTranslation("tours");
  const { isLogin } = useSelector((state) => state.loginReducer);
  const navigate = useNavigate();
  const location = useLocation();

  const [isFav, setIsFav] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false); // Thêm state chống spam

  // Kiểm tra trạng thái yêu thích khi load
  useEffect(() => {
    const fetchFav = async () => {
      if (!isLogin) return;
      try {
        const result = await getFavoriteStatus(tour.id);
        setIsFav(result.data?.isFavorite);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái yêu thích", error);
      }
    };
    fetchFav();
  }, [tour.id, isLogin]);

  // Yêu cầu đăng nhập nếu chưa login (dùng chung cho favorite & booking)
  const requireLogin = (onConfirm) => {
    Swal.fire({
      title: t("detail.favLoginTitle"),
      text: t("detail.favLoginText"),
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#0062cc",
      cancelButtonColor: "#888",
      confirmButtonText: t("detail.qaLoginBtn"),
      cancelButtonText: t("detail.qaCloseBtn"),
    }).then((res) => {
      if (res.isConfirmed) onConfirm();
    });
  };

  // Toggle yêu thích
  const handleFavClick = async () => {
    if (isFavLoading) return; // Nếu đang xử lý API thì không cho bấm tiếp (chống spam)

    if (!isLogin) {
      requireLogin(() =>
        navigate("/login", { state: { from: location.pathname } }),
      );
      return;
    }

    setIsFavLoading(true); // Bật khiên chống spam
    try {
      if (isFav) {
        await removeFavorite(tour.id);
        setIsFav(false);
        Swal.fire({
          icon: "info",
          title: t("detail.favRemoveSuccess"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        await addFavorite(tour.id);
        setIsFav(true);
        Swal.fire({
          icon: "success",
          title: t("detail.favAddSuccess"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Lỗi thả tim", error);
    } finally {
      setIsFavLoading(false); // Tắt khiên khi API gọi xong
    }
  };

  // Dịch tên phương tiện
  const TRANSPORT_MAP = {
    BUS: t("filter.transBus"),
    AIRPLANE: t("filter.transFlight"),
    MOTORBIKE: t("filter.transMotorbike"),
  };

  // Category label
  const catKey =
    (tour.category || "Standard").charAt(0).toUpperCase() +
    (tour.category || "Standard").slice(1).toLowerCase();
  const catLabel = t(`filter.cat${catKey}`, {
    defaultValue: tour.category || "Standard",
  });

  return (
    <div className="product-info">
      {/* Header: Tên + nút yêu thích */}
      <div className="product-info__header">
        <h1 className="product-info__name">{tour.name}</h1>
        <button
          className={`product-info__fav-btn${isFav ? " product-info__fav-btn--active" : ""}`}
          onClick={handleFavClick}
          disabled={isFavLoading}
          style={{
            opacity: isFavLoading ? 0.5 : 1,
            cursor: isFavLoading ? "wait" : "pointer",
          }}
          title={isFav ? t("detail.favRemoveTitle") : t("detail.favAddTitle")}
          aria-label={
            isFav ? t("detail.favRemoveTitle") : t("detail.favAddTitle")
          }
        >
          {isFav ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>

      {/* Giá + badge danh mục */}
      <div className="product-info__price-row">
        <span className="product-info__price">{formatPrice(tour.price)}</span>
        <span
          className={`product-info__badge product-info__badge--${(tour.category || "standard").toLowerCase()}`}
        >
          {catLabel}
        </span>
      </div>

      {/* Mô tả ngắn */}
      {tour.shortDesc && (
        <p className="product-info__short-desc">{tour.shortDesc}</p>
      )}

      {/* Thông tin chi tiết */}
      <div className="product-info__variants">
        <div className="product-info__variant">
          <span className="product-info__variant-icon">
            <CalendarOutlined />
          </span>
          <div className="product-info__variant-text">
            <span className="product-info__variant-label">
              {t("detail.duration")}
            </span>
            <strong className="product-info__variant-value">
              {formatDate(tour.startDate)} → {formatDate(tour.endDate)}
            </strong>
          </div>
        </div>

        <div className="product-info__variant">
          <span className="product-info__variant-icon">
            <EnvironmentOutlined />
          </span>
          <div className="product-info__variant-text">
            <span className="product-info__variant-label">
              {t("detail.journey")}
            </span>
            <strong className="product-info__variant-value">
              {tour.departurePlace || "..."} → {tour.destination || "..."}
            </strong>
          </div>
        </div>

        <div className="product-info__variant">
          <span className="product-info__variant-icon">
            <UsergroupAddOutlined />
          </span>
          <div className="product-info__variant-text">
            <span className="product-info__variant-label">
              {t("detail.status")}
            </span>
            <strong className="product-info__variant-value">
              {tour.isAvailable ? (
                <span className="product-info__available">
                  <CheckCircleOutlined />{" "}
                  {t("detail.slotsAvailable", { count: tour.availableSeats })}
                </span>
              ) : (
                <span className="product-info__unavailable">
                  <CloseCircleOutlined /> {t("detail.fullyBooked")}
                </span>
              )}
            </strong>
          </div>
        </div>

        <div className="product-info__variant">
          <span className="product-info__variant-icon">
            <FireOutlined />
          </span>
          <div className="product-info__variant-text">
            <span className="product-info__variant-label">
              {t("detail.sold")}
            </span>
            <strong className="product-info__variant-value">
              {tour.sold || 0} {t("detail.guests")}
            </strong>
          </div>
        </div>

        {tour.transport && (
          <div className="product-info__variant product-info__variant--full">
            <span className="product-info__variant-icon">
              <CarOutlined />
            </span>
            <div className="product-info__variant-text">
              <span className="product-info__variant-label">
                {t("filter.transport")}
              </span>
              <strong className="product-info__variant-value">
                {TRANSPORT_MAP[tour.transport] || tour.transport}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Nút đặt tour */}
      <div className="product-info__booking">
        {tour.isAvailable ? (
          <Link
            to={`/order-booking/${tour.id}`}
            className="product-info__btn-book"
          >
            <strong>{t("detail.bookNow")}</strong>
            <span>{t("detail.bookSub")}</span>
          </Link>
        ) : (
          <button
            className="product-info__btn-book product-info__btn-book--disabled"
            disabled
          >
            <strong>{t("detail.fullyBookedBtn")}</strong>
            <span>{t("detail.contactSub")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
