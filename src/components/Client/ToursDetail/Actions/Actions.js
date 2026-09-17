import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FloatButton, Dropdown } from "antd";
import {
  MenuOutlined,
  FileTextOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useScroll } from "../../../../hooks/useScroll";

const ProductActions = ({ descRef, reviewsRef, qaRef, tour }) => {
  const { t } = useTranslation("tours");
  const [activeTab, setActiveTab] = useState("description");
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Dùng useMemo để ghi nhớ mảng tabs, tránh việc mảng bị tạo lại mới liên tục mỗi khi màn hình render
  const tabs = useMemo(
    () => [
      {
        key: "description",
        label: t("detail.descTitle"),
        icon: <FileTextOutlined />,
        ref: descRef,
      },
      {
        key: "reviews",
        label: t("detail.tabReviews"),
        icon: <CommentOutlined />,
        ref: reviewsRef,
      },
      {
        key: "qa",
        label: t("detail.tabQA"),
        icon: <QuestionCircleOutlined />,
        ref: qaRef,
      },
    ],
    [t, descRef, reviewsRef, qaRef],
  );

  const scrollY = useScroll();

  // LOGIC THEO DÕI CUỘN TRANG
  useEffect(() => {
    if (!tour) return;

    // 1. Logic đổi màu Tab: Cứ mục nào cách mép trên màn hình dưới 250px thì lấy mục đó
    let currentActive = "description"; // 1. Mặc định ban đầu chọn Tab Mô tả
    tabs.forEach((tab) => {
      if (tab.ref.current) {
        // 2. Đo khoảng cách từ đỉnh khối đó tới mép trên màn hình bạn đang nhìn
        const topPosition = tab.ref.current.getBoundingClientRect().top;
        // 3. Nếu đỉnh khối đó đã cuộn lên cao và cách mép trên nhỏ hơn 250px
        if (topPosition <= 250) {
          currentActive = tab.key; // Ghi đè tab đang kích hoạt bằng khối này
        }
      }
    });
    setActiveTab(currentActive); // 4. Cập nhật lại màu sắc cho thanh Tab ngoài giao diện

    // 2. Logic hiện/ẩn nút FloatButton trên Mobile: Khi cuộn tới mục mô tả thì hiện nút lên
    if (descRef?.current) {
      // khoảng cách từ khung nhìn tới mô tả
      const rect = descRef.current.getBoundingClientRect();
      // window.innerHeight: chiều cao toàn bộ màn hình điện thoại
      // vd: 800 - 200 = 600
      if (rect.top <= window.innerHeight - 200) {
        setIsVisible(true); // Nếu lọt vào rồi -> Hiện nút Menu tròn lên
      } else {
        setIsVisible(false); // Nếu đang ở trên cùng trang web -> Ẩn nút đi
        setOpen(false); // Nếu menu đang mở cũng tự động đóng lại
      }
    }
  }, [tour, descRef, tabs, scrollY]);

  // HÀM XỬ LÝ CLICK CUỘN TRANG MƯỢT MÀ
  const handleScrollToSection = (tabKey, targetRef) => {
    setActiveTab(tabKey); // Đổi màu tab ngay lập tức khi click
    setOpen(false); // Đóng menu trên mobile

    if (targetRef?.current) {
      const isMobile = window.innerWidth <= 576;
      const offset = isMobile ? 80 : 180; // Khoảng cách trừ hao để không bị Header đè chữ

      // Hàm getBoundingClientRect() là một phương thức trong JavaScript dùng để lấy kích thước và vị trí của một phần tử so với viewport
      // targetRef.current.getBoundingClientRect().top
      // Tính từ mép trên cùng của màn hình hiện tại bạn đang nhìn, đi xuống đến chữ "Hỏi đáp" là bao nhiêu pixel

      // window.pageYOffset
      //  độ dài trang web mà bạn đã lướt qua từ nãy đến giờ.

      // offset: khoảng cách trừ hao cái header scroll
      const top =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Giao diện Desktop / iPad: Thanh Tabs nằm ngang */}
      <div className="tour-detail__tabs">
        <div className="tour-detail__tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tour-detail__tab ${activeTab === tab.key ? "tour-detail__tab--active" : ""}`}
              onClick={() => handleScrollToSection(tab.key, tab.ref)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Giao diện Mobile: Nút nổi và Menu Dropdown */}
      <div className="tour-detail__float-menu">
        <Dropdown
          menu={{
            // Lấy luôn mảng tabs ở trên, đảo ngược lại để Q&A lên đầu giống bản gốc của bạn
            items: [...tabs].reverse().map((tab) => ({
              key: tab.key,
              icon: tab.icon,
              label: tab.label,
              onClick: () => handleScrollToSection(tab.key, tab.ref),
            })),
          }}
          trigger={["click"]}
          placement="topRight"
          open={open}
          onOpenChange={setOpen}
        >
          <FloatButton
            type="primary"
            icon={<MenuOutlined />}
            style={{
              right: 24,
              bottom: 74,
              opacity: isVisible ? 1 : 0,
              visibility: isVisible ? "visible" : "hidden",
              pointerEvents: isVisible ? "auto" : "none",
              transition: "all 0.3s ease-in-out",
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          />
        </Dropdown>
      </div>
    </>
  );
};

export default ProductActions;
