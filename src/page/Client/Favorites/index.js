import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Button, Result } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getFavorites, removeFavorite } from "../../../services/favorite";
import {
  formatPrice,
  formatDate,
  getDuration,
} from "../../../helpers/format/format";
import { useTranslation } from "react-i18next";
import { IMAGE_URLS } from "../../../constants/api";
import fallbackImage from "../../../assets/images/fallbackImage.jpg";
import Swal from "sweetalert2";
import "./Favorites.scss";

const Favorites = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLogin } = useSelector((state) => state.loginReducer);
  const navigate = useNavigate();
  const { t } = useTranslation("tours");
  const urlImage = IMAGE_URLS.TOURS;

  const fetchFavorites = async () => {
    if (!isLogin) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getFavorites();
      if (res?.success) {
        // Tuỳ thuộc vào API trả về mảng trực tiếp hay lồng trong data
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data?.tours || [];
        setTours(list);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  const handleRemoveFavorite = async (tourId, e) => {
    e.stopPropagation(); // Ngăn sự kiện click Card
    try {
      const res = await removeFavorite(tourId);
      if (res?.success || res) {
        setTours((prev) =>
          prev.filter((tour) => tour.id !== tourId && tour._id !== tourId),
        );
        Swal.fire({
          icon: "info",
          title: t("detail.favRemoveSuccess"),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Lỗi xóa tour yêu thích:", error);
    }
  };

  return (
    <>
      <h2 className="profile-page-title">{t("favorites.title")}</h2>
      <div className="favorites-page">
        <div className="favorites-page__content">
          {!isLogin ? (
            <Result
              icon={<HeartOutlined style={{ color: "#d9d9d9" }} />}
              title={t("favorites.loginReqTitle")}
              subTitle={t("favorites.loginReqSub")}
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/login")}
                >
                  {t("favorites.loginBtn")}
                </Button>
              }
            />
          ) : loading ? (
            <div className="favorites-page__loading">
              <Spin size="large" />
            </div>
          ) : tours.length === 0 ? (
            <Result
              icon={<HeartOutlined style={{ color: "#ff4d4f" }} />}
              title={t("favorites.emptyTitle")}
              subTitle={t("favorites.emptySub")}
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/tours")}
                >
                  {t("favorites.exploreBtn")}
                </Button>
              }
            />
          ) : (
            <div style={{ marginTop: 0 }}>
              <Row gutter={[16, 24]}>
                {tours.map((item) => {
                  // API favorites có thể trả về object chứa { id, tour: {...} }
                  // Dùng trực tiếp item hoặc item.tour tuỳ thuộc cấu trúc API
                  const tour = item.tour ? item.tour : item;

                  return (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={8}
                      key={tour.id || tour._id}
                    >
                      <Card
                        hoverable
                        className="tour-compact-card favorites-page__card"
                        onClick={() => navigate(`/tours/${tour.slug}`)}
                        styles={{
                          body: {
                            display: "flex",
                            flexDirection: "column",
                            padding: 0,
                            height: "100%",
                          },
                        }}
                      >
                        {/* Nút hủy yêu thích nổi */}
                        <button
                          className="favorites-page__remove-btn"
                          onClick={(e) =>
                            handleRemoveFavorite(tour.id || tour._id, e)
                          }
                          title={t("detail.favRemoveTitle")}
                        >
                          <HeartFilled />
                        </button>

                        <div className="tour-compact-card__hero">
                          <img
                            src={
                              tour.thumbnail
                                ? urlImage + tour.thumbnail
                                : fallbackImage
                            }
                            alt={tour.name}
                            className="tour-compact-card__image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackImage;
                            }}
                          />
                          <div className="tour-compact-card__badge">
                            {t("related.from", "Từ")}{" "}
                            {tour.departurePlace === "Ho Chi Minh City" ||
                            tour.departurePlace === "HCM"
                              ? "Hồ Chí Minh"
                              : tour.departurePlace || "Hồ Chí Minh"}
                          </div>

                          <div className="tour-compact-card__overlay">
                            <div className="tour-compact-card__overlay-content">
                              <p className="tour-compact-card__overlay-desc">
                                {tour.shortDesc || tour.name}
                              </p>
                              <p className="tour-compact-card__overlay-detail">
                                {t("related.itinerary")}{" "}
                                {tour.duration ||
                                  getDuration(tour.startDate, tour.endDate)}
                              </p>
                              <p className="tour-compact-card__overlay-detail">
                                {t("related.departure")}{" "}
                                {tour.startDate
                                  ? formatDate(tour.startDate)
                                  : "..."}
                              </p>
                              <p className="tour-compact-card__overlay-detail">
                                {t("related.transport")}{" "}
                                {tour.transport || "..."}
                              </p>
                            </div>
                            <span className="tour-compact-card__overlay-more">
                              {t("related.viewMore")}
                            </span>
                          </div>
                        </div>

                        <div className="tour-compact-card__title-box">
                          <h3 className="tour-compact-card__title">
                            {tour.name}
                          </h3>
                        </div>

                        <div className="tour-compact-card__info-box">
                          <div className="tour-compact-card__info-left">
                            <div className="tour-compact-card__info-item">
                              <ClockCircleOutlined className="tour-compact-card__icon" />{" "}
                              {tour.duration ||
                                getDuration(tour.startDate, tour.endDate)}
                            </div>
                            <div className="tour-compact-card__info-item">
                              <CalendarOutlined className="tour-compact-card__icon" />{" "}
                              {tour.startDate
                                ? formatDate(tour.startDate)
                                : "Đang cập nhật"}
                            </div>
                          </div>
                          <div className="tour-compact-card__info-right">
                            <span className="tour-compact-card__price">
                              {formatPrice(tour.price)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorites;
