import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { getTourBySlug } from "../../../services/tour";
import { IMAGE_URLS } from "../../../constants/api";
import { Collapse } from "antd";
import Gallery from "../../../components/Client/ToursDetail/Gallery/Gallery";
import Info from "../../../components/Client/ToursDetail/Info/Info";
import Actions from "../../../components/Client/ToursDetail/Actions/Actions";
import ToursRelated from "../../../components/Client/ToursRelated";
import Reviews from "../../../components/Client/ToursDetail/Review/Reviews";
import QA from "../../../components/Client/ToursDetail/QA/QA";
import Notes from "../../../components/Client/ToursDetail/Notes/Notes";
import { useTranslation } from "react-i18next";
import "./ToursDetail.scss";

function ToursDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("tours");
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Refs cho việc scroll cuộn
  const descRef = useRef(null);
  const reviewsRef = useRef(null);
  const qaRef = useRef(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await getTourBySlug(id);
        if (res?.success) {
          setTour(res.data);
          window.scrollTo({ top: 0, behavior: "instant" }); // Cuộn lên đầu sau khi data load xong
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết tour:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  // Xử lý ảnh phụ
  let Images = [];
  const tourImages = tour?.images;
  //Nếu là mảng
  if (Array.isArray(tourImages)) {
    Images = tourImages;
  }
  //Nếu là chuỗi
  else if (typeof tourImages === "string") {
    try {
      //Chuyển dữ liệu sang JavaScript
      const subArray = JSON.parse(tourImages);
      //Nếu là mảng
      if (Array.isArray(subArray)) {
        Images = subArray;
      }
      //Nếu là chuỗi đơn lẻ
      else {
        Images = [subArray];
      }
    } catch (error) {
      //TH chuỗi thuần túy lỗi -> JSON.parse('abc,bcd')
      if (tourImages.includes(",")) {
        Images = tourImages.split(",").map((i) => i.trim());
        //TH chỉ có kí tự  lỗi -> JSON.parse('anh-bia.jpg')
      } else {
        Images = [tourImages];
      }
    }
  }

  return (
    <div className="tour-detail">
      <div className="tour-detail__container">
        {loading ? (
          <div className="tour-detail__loading">
            <Spin size="large" />
          </div>
        ) : !tour ? (
          <div className="tour-detail__not-found">
            <h3>{t("detail.notFound")}</h3>
            <Link to="/tours" className="tour-detail__btn-back">
              {t("detail.backToList")}
            </Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <Breadcrumb
              className="tour-detail__breadcrumb"
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
                  title: <span>{tour.name}</span>,
                },
              ]}
            />

            {/* Top: Gallery + Info */}
            <div className="tour-detail__top">
              <div className="tour-detail__left">
                <Gallery
                  thumbnail={tour.thumbnail || tour.image}
                  images={Images}
                  tourName={tour.name}
                  urlImage={IMAGE_URLS.TOURS}
                />
              </div>
              <div className="tour-detail__right">
                <Info tour={tour} />
              </div>
            </div>

            {/* Tabs */}
            <Actions
              descRef={descRef}
              reviewsRef={reviewsRef}
              qaRef={qaRef}
              tour={tour}
            />

            {/* Mô tả chi tiết */}
            <div
              className="tour-detail__section"
              ref={descRef}
              id="section-description"
            >
              <Collapse
                ghost
                expandIcon={() => null}
                activeKey={isDescOpen ? ["1"] : []}
                onChange={(keys) => setIsDescOpen(keys.length > 0)}
                items={[
                  {
                    key: "1",
                    label: (
                      <div className="tour-detail__panel">
                        <span className="tour-detail__panel-title">
                          {t("detail.descTitle")}
                        </span>
                        <span className="tour-detail__panel-action">
                          {isDescOpen
                            ? t("detail.collapseBtn")
                            : t("detail.expandBtn")}
                        </span>
                      </div>
                    ),
                    children: tour.detailDesc ? (
                      <div
                        className="tour-detail__html-content"
                        dangerouslySetInnerHTML={{ __html: tour.detailDesc }}
                      />
                    ) : (
                      <p className="tour-detail__no-content">
                        {t("detail.descUpdating")}
                      </p>
                    ),
                  },
                ]}
              />
            </div>

            {/* Những thông tin cần lưu ý */}
            <div className="tour-detail__section" id="section-notes">
              <Collapse
                ghost
                expandIcon={() => null}
                activeKey={isNotesOpen ? ["notes"] : []}
                onChange={(keys) => setIsNotesOpen(keys.length > 0)}
                items={[
                  {
                    key: "notes",
                    label: (
                      <div className="tour-detail__panel">
                        <span className="tour-detail__panel-title">
                          {t("detail.notesTitle")}
                        </span>
                        <span className="tour-detail__panel-action">
                          {isNotesOpen
                            ? t("detail.collapseBtn")
                            : t("detail.expandBtn")}
                        </span>
                      </div>
                    ),
                    children: <Notes tour={tour} />,
                  },
                ]}
              />
            </div>

            {/* Đánh giá */}
            <div
              className="tour-detail__section"
              ref={reviewsRef}
              id="section-reviews"
            >
              <h2 className="tour-detail__title tour-detail__title--bar">
                {t("detail.reviewsTitle")}
              </h2>
              <Reviews />
            </div>

            {/* Hỏi đáp */}
            <div className="tour-detail__section" ref={qaRef} id="section-qa">
              <h2 className="tour-detail__title tour-detail__title--bar">
                {t("detail.qaTitleHeader")}
              </h2>
              <QA />
            </div>

            {/* Tour liên quan */}
            <ToursRelated currentTour={tour} />
          </>
        )}
      </div>
    </div>
  );
}

export default ToursDetail;
