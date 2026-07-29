import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Breadcrumb } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { getTourBySlug } from "../../../services/tour";
import { IMAGE_URLS } from "../../../constants/api";
import { Collapse } from "antd";
import ProductGallery from "../../../components/Client/ToursDetail/ProductGallery";
import ProductInfo from "../../../components/Client/ToursDetail/ProductInfo";
import ToursRelated from "../../../components/Client/ToursRelated";
import TourReviews from "../../../components/Client/ToursDetail/TourReviews";
import TourQA from "../../../components/Client/ToursDetail/TourQA";
import TourNotes from "../../../components/Client/ToursDetail/TourNotes";
import { useTranslation } from "react-i18next";
import "./ToursDetail.scss";

function ToursDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("tours");
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Active tab phục vụ scroll spy menu (Mô tả, Đánh giá, Hỏi đáp)
  const [activeTab, setActiveTab] = useState("description");

  // Refs cho việc scroll cuộn
  const descRef = useRef(null);
  const reviewsRef = useRef(null);
  const qaRef = useRef(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await getTourBySlug(id);
        if (res?.success) setTour(res.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết tour:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleScrolls = (tabName) => {
    setActiveTab(tabName);

    let targetRef = null;
    if (tabName === "description") targetRef = descRef;
    else if (tabName === "reviews") targetRef = reviewsRef;
    else if (tabName === "qa") targetRef = qaRef;

    if (targetRef?.current) {
      const isMobile = window.innerWidth <= 576;
      // Mobile: nhảy thẳng đến section (instant), desktop: cuộn mượt (smooth)
      // Tăng offset lên để title không bị sát thanh tab
      const offset = isMobile ? 130 : 180;
      const top =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        offset;
      window.scrollTo({ top, behavior: isMobile ? "instant" : "smooth" });
    }
  };

  // Tự động active tab
  useEffect(() => {
    // Chặn chạy code nếu dữ liệu tour chưa tải xong (tránh lỗi)
    if (!tour) return;
    // Biến ghi nhớ tab trước đó để tránh bắt React vẽ lại giao diện liên tục
    let previousTab = "description";
    // Khóa an toàn: Chặn không cho hàng trăm sự kiện cuộn tràn vào cùng lúc
    let isLocked = false;
    const handleWindowScroll = () => {
      // Nếu cửa đang mở (chưa bị khóa) thì mới xử lý
      if (!isLocked) {
        // Đồng bộ code chạy theo đúng nhịp quét màn hình điện thoại (60Hz/120Hz)
        window.requestAnimationFrame(() => {
          // Vị trí cuộn chuột hiện tại cộng thêm 200px làm vạch quét bắt vị trí
          const currentScrollPosition = window.scrollY + 200;
          // Danh sách các khu vực cần theo dõi tọa độ
          const targetSections = [
            { key: "description", ref: descRef },
            { key: "reviews", ref: reviewsRef },
            { key: "qa", ref: qaRef },
          ];
          // Mặc định ban đầu coi như đang ở Tab Mô tả
          let activeSectionKey = "description";
          // Vòng lặp quét vị trí cuốn chiếu từ trên xuống dưới
          for (const section of targetSections) {
            // Nếu thẻ HTML đã sẵn sàng VÀ vạch chuột đã vượt qua đỉnh của khu vực đó
            if (
              section.ref.current &&
              section.ref.current.offsetTop <= currentScrollPosition
            ) {
              activeSectionKey = section.key; // Khu vực nằm dưới sẽ ghi đè tên lên khu vực trên
            }
          }
          // ĐOẠN CHỐNG GIẬT: Chỉ khi thực sự chuyển sang vùng mới thì mới đổi màu Tab
          if (activeSectionKey !== previousTab) {
            previousTab = activeSectionKey; // Cập nhật lại biến ghi nhớ
            setActiveTab(activeSectionKey); // Báo React tô đậm nút Tab mới
          }
          // Mở khóa an toàn sau khi trình duyệt đã xử lý xong khung hình này
          isLocked = false;
        });
        // LẬP TỨC KHÓA CỬA lại, vứt sọt rác tất cả các sự kiện cuộn thừa thãi tiếp theo
        isLocked = true;
      }
    };
    // Đăng ký sự kiện cuộn với trình duyệt (passive: true giúp lướt trang mượt hơn)
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    // Hủy đăng ký khi người dùng chuyển trang để tránh bị tốn RAM ngầm (Rò rỉ bộ nhớ)
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [tour]);

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

  const tabs = [
    {
      key: "description",
      label: t("detail.descTitle"),
      icon: <FileTextOutlined />,
    },
    {
      key: "reviews",
      label: t("detail.tabReviews"),
      icon: <CommentOutlined />,
    },
    { key: "qa", label: t("detail.tabQA"), icon: <QuestionCircleOutlined /> },
  ];

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
                <ProductGallery
                  thumbnail={tour.thumbnail || tour.image}
                  images={Images}
                  tourName={tour.name}
                  urlImage={IMAGE_URLS.TOURS}
                />
              </div>
              <div className="tour-detail__right">
                <ProductInfo tour={tour} />
              </div>
            </div>

            {/* Tabs */}
            <div className="tour-detail__tabs">
              <div className="tour-detail__tab-list">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`tour-detail__tab ${activeTab === tab.key ? "tour-detail__tab--active" : ""}`}
                    onClick={() => handleScrolls(tab.key)}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

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
                    children: <TourNotes tour={tour} />,
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
              <TourReviews />
            </div>

            {/* Hỏi đáp */}
            <div className="tour-detail__section" ref={qaRef} id="section-qa">
              <h2 className="tour-detail__title tour-detail__title--bar">
                {t("detail.qaTitleHeader")}
              </h2>
              <TourQA />
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
