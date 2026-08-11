import { useState, useCallback, useEffect, useRef } from "react";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import Filters from "../../../components/Client/ToursAll/Filters";
import HeaderSearch from "../../../components/Client/ToursAll/HeaderSearch";
import TourResults from "../../../components/Client/ToursAll/TourResults";
import {
  MobileFilterBar,
  MobileDrawers,
} from "../../../components/Client/ToursAll/MobileFilter";
import { useScroll } from "../../../hooks/useScroll";
import "./ToursAll.scss";

let cachedPriceRange = null;

function ToursAll() {
  const { t } = useTranslation("tours");
  const resultsRef = useRef(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(
    cachedPriceRange || { min: 0, max: 200000000 },
  );

  const scrollY = useScroll();

  useEffect(() => {
    if (resultsRef.current) {
      //getBoundingClientRect: Tính toán khoảng cách p/tử resultsRef tới khung nhìn
      // getBoundingClientRect có hàm top, bottom
      // top: khoảng cách cạnh trên p/tử đến khung nhìn
      // bottom: khoảng cách cạnh dưới p/tử đến khung nhìn
      const rect = resultsRef.current.getBoundingClientRect();

      if (rect.top <= -200 && rect.bottom > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setMenuOpen(false);
      }
    }
  }, [scrollY]);

  // HÀM CẬP NHẬT KHOẢNG GIÁ MỚI
  const handlePriceRangeUpdate = useCallback((newRange) => {
    setPriceRange((prev) => {
      if (prev.min === newRange.min && prev.max === newRange.max) {
        return prev; // ...thì TRẢ VỀ CHÍNH NÓ (Không thay đổi state, giao diện không cần load lại).
      }
      // LƯU VÀO BỘ NHỚ ĐỆM BIẾN TOÀN CỤC
      // Mục đích: Để nếu người dùng có chuyển trang rồi quay lại,
      // hệ thống vẫn nhớ khoảng giá này mà không bị reset về 0đ.
      cachedPriceRange = newRange;
      // Trả về khoảng giá mới để React cập nhật lên giao diện cho người dùng thấy.
      return newRange;
    });
  }, []);

  return (
    <div className="tour-page">
      <div className="tour-page__container">
        {/* ---- Section Header ---- */}
        <div className="tour-page__header">
          <p className="tour-page__label">{t("header.label")}</p>
          <h1 className="tour-page__title">{t("header.title")}</h1>
        </div>

        <Row gutter={[24, 24]}>
          {/* Cột trái: Bộ lọc */}
          <Col xs={0} lg={7} xl={6} className="tour-page__sidebar-col">
            <div className="tour-page__sidebar">
              <Filters priceRange={priceRange} />
            </div>
          </Col>

          {/* Cột phải: Thanh tìm kiếm & Danh sách tour */}
          <Col xs={24} lg={17} xl={18} className="tour-page__content">
            <div className="tour-page__search">
              <HeaderSearch />
            </div>
            <div className="tour-page__results" ref={resultsRef}>
              <TourResults onPriceRangeUpdate={handlePriceRangeUpdate} />
            </div>

            {/* Nút hiển thị bộ lọc, tròn nổi ở góc dưới */}
            <MobileFilterBar
              t={t}
              isVisible={isVisible}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setFilterDrawerOpen={setFilterDrawerOpen}
              setSearchDrawerOpen={setSearchDrawerOpen}
            />
          </Col>
        </Row>
      </div>

      {/* Cái bảng trượt từ cạnh màn hình ra */}
      <MobileDrawers
        t={t}
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        searchDrawerOpen={searchDrawerOpen}
        setSearchDrawerOpen={setSearchDrawerOpen}
        priceRange={priceRange}
      />
    </div>
  );
}

export default ToursAll;
