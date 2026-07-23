import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { getTourBySlug } from "../../../services/tour";
import { IMAGE_URLS } from "../../../constants/api";
import ProductGallery from "../../../components/Client/ToursDetail/ProductGallery";
import ProductActions from "../../../components/Client/ToursDetail/ProductActions";
import ProductInfo from "../../../components/Client/ToursDetail/ProductInfo";
import ToursRelated from "../../../components/Client/ToursRelated";
import TourReviews from "../../../components/Client/ToursDetail/TourReviews";
import TourQA from "../../../components/Client/ToursDetail/TourQA";
import { useTranslation } from "react-i18next";
import "./ToursDetail.scss";

function ToursDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("tours");

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await getTourBySlug(id);
        if (res?.success) setTour(res.data);
      } catch (err) {
        console.error("Lỗi fetch tour detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading)
    return (
      <div className="td-loading">
        <Spin size="large" />
      </div>
    );

  if (!tour) {
    return (
      <div className="td-not-found">
        <h3>{t("detail.notFound")}</h3>
        <Link to="/tours" className="btn-back">
          {t("detail.backToList")}
        </Link>
      </div>
    );
  }

  // Xử lý ảnh đơn giản
  const rawImages = [tour.image || tour.thumbnail, ...(tour.images || [])];
  const allImages = [...new Set(rawImages)].filter(Boolean).map((img) => {
    if (img.startsWith("http")) return img;
    return IMAGE_URLS.TOURS + img;
  });

  return (
    <div className="product-detail-page">
      <div className="pd-container">
        {/* Breadcrumb sử dụng Ant Design */}
        <Breadcrumb
          className="pd-breadcrumb"
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined /> {t("detail.home")}
                </Link>
              ),
            },
            {
              title: <Link to="/tours">{t("detail.tours")}</Link>,
            },
            {
              title: <span className="current">{tour.name}</span>,
            },
          ]}
        />

        {/* Khung giao diện chính (Giống CellphoneS) */}
        <Row gutter={[24, 24]} className="pd-main-section">
          {/* Bên trái: Ảnh & Nút tương tác */}
          <Col xs={24} md={12} lg={10} className="pd-left">
            <ProductActions />
            <ProductGallery images={allImages} tourName={tour.name} />
          </Col>

          {/* Bên phải: Thông tin, Giá, Ưu đãi */}
          <Col xs={24} md={12} lg={14} className="pd-right">
            <ProductInfo tour={tour} />
          </Col>
        </Row>

        {/* Nội dung chi tiết */}
        <div className="pd-content-section">
          <h2 className="section-title">{t("detail.descTitle")}</h2>
          <div className="content-box">
            {tour.detailDesc ? (
              tour.detailDesc
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, index) => (
                  <div key={index} className="timeline-item">
                    <p className="raw-text">{line}</p>
                  </div>
                ))
            ) : (
              <p className="raw-text">{t("detail.descUpdating")}</p>
            )}
          </div>
        </div>

        {/* Các Component mở rộng */}
        <ToursRelated />
        <TourReviews />
        <TourQA />
      </div>
    </div>
  );
}

export default ToursDetail;
