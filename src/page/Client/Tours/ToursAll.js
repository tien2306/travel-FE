import { useState, useCallback, useEffect, useRef } from "react";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import SidebarFilter from "../../../components/Client/ToursAll/Filters/SidebarFilter";
import HeaderSearch from "../../../components/Client/ToursAll/Search/HeaderSearch";
import TourListResults from "../../../components/Client/ToursAll/Results/TourListResults";
import MobileFilterBar from "../../../components/Client/ToursAll/Mobile/MobileFilterBar";
import MobileDrawers from "../../../components/Client/ToursAll/Mobile/MobileDrawers";
import "./ToursAll.scss";

let cachedPriceRange = null;

function ToursAll() {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  // 1. KHỞI TẠO STATE LƯU TRỮ KHOẢNG GIÁ (DÙNG ĐỂ HIỂN THỊ TRÊN THANH TRƯỢT SLIDER)
  // - useState này sẽ kiểm tra xem trong bộ nhớ đệm (cachedPriceRange) đã có khoảng giá chưa.
  // - Nếu CÓ: Lấy luôn giá trị trong cachedPriceRange làm giá trị bắt đầu.
  // - Nếu CHƯA CÓ (Lần đầu vào trang): Lấy giá trị mặc định là từ 0đ đến 200.000.000đ.
  const [priceRange, setPriceRange] = useState(
    cachedPriceRange || { min: 0, max: 200000000 },
  );

  const resultsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. CÔNG CỤ ĐA NGÔN NGỮ
  // Hook này giúp bạn dịch các chữ trên giao diện sang tiếng Anh/Việt dựa vào file cấu hình "tours".
  const { t } = useTranslation("tours");

  // 3. HÀM CẬP NHẬT KHOẢNG GIÁ MỚI (VÍ DỤ KHI API TRẢ VỀ KHOẢNG GIÁ THỰC TẾ CỦA TOUR)
  // useCallback dùng để "đóng băng" hàm này, giúp nó không bị tạo lại lãng phí mỗi khi component render lại.
  const handlePriceRangeUpdate = useCallback((newRange) => {
    // Dùng hàm cập nhật state dạng callback (nhận vào giá trị cũ 'prev' để tính toán giá trị mới)
    setPriceRange((prev) => {
      // BƯỚC 1: KIỂM TRA CHỐNG LẶP (TỐI ƯU HIỆU NĂNG)
      // Nếu mức giá tối thiểu (min) VÀ giá tối đa (max) mới gửi vào GIỐNG Y HỆT mức giá cũ đang có...
      if (prev.min === newRange.min && prev.max === newRange.max) {
        return prev; // ...thì TRẢ VỀ CHÍNH NÓ (Không thay đổi state, giao diện không cần load lại).
      }

      // BƯỚC 2: LƯU VÀO BỘ NHỚ ĐỆM BIẾN TOÀN CỤC
      // Nếu giá mới khác giá cũ, tiến hành lưu đè giá trị mới này vào biến 'cachedPriceRange' ở bên ngoài.
      // Mục đích: Để nếu người dùng có chuyển trang rồi quay lại, hệ thống vẫn nhớ khoảng giá này mà không bị reset về 0đ.
      cachedPriceRange = newRange;

      // BƯỚC 3: CẬP NHẬT STATE MỚI
      // Trả về khoảng giá mới để React cập nhật lên giao diện cho người dùng thấy.
      return newRange;
    });
  }, []);

  return (
    <div className="tour-page">
      <div className="tour-page__container">
        <Row gutter={[24, 24]}>
          {/* Cột trái: Bộ lọc */}
          <Col xs={0} lg={7} xl={6} className="tour-page__sidebar-col">
            <div className="tour-page__sidebar">
              <SidebarFilter priceRange={priceRange} />
            </div>
          </Col>

          {/* Cột phải: Thanh tìm kiếm & Danh sách tour */}
          <Col xs={24} lg={17} xl={18} className="tour-page__content">
            <div className="tour-page__search">
              <HeaderSearch />
            </div>
            <div className="tour-page__results" ref={resultsRef}>
              <TourListResults onPriceRangeUpdate={handlePriceRangeUpdate} />
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
