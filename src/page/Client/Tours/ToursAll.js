import { useState, useCallback } from "react";
import { Row, Col, Drawer, Button } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import SidebarFilter from "../../../components/Client/ToursAll/SidebarFilter";
import HeaderSearch from "../../../components/Client/ToursAll/HeaderSearch";
import TourListResults from "../../../components/Client/ToursAll/TourListResults";
import "./ToursAll.scss";

let cachedPriceRange = null;

function ToursAll() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 1. KHỞI TẠO STATE LƯU TRỮ KHOẢNG GIÁ (DÙNG ĐỂ HIỂN THỊ TRÊN THANH TRƯỢT SLIDER)
  // - useState này sẽ kiểm tra xem trong bộ nhớ đệm (cachedPriceRange) đã có khoảng giá chưa.
  // - Nếu CÓ: Lấy luôn giá trị trong cachedPriceRange làm giá trị bắt đầu.
  // - Nếu CHƯA CÓ (Lần đầu vào trang): Lấy giá trị mặc định là từ 0đ đến 200.000.000đ.
  const [priceRange, setPriceRange] = useState(
    cachedPriceRange || { min: 0, max: 200000000 },
  );

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
          <Col xs={0} lg={6} xl={5} className="tour-page__sidebar-col">
            <div className="tour-page__sidebar">
              <SidebarFilter priceRange={priceRange} />
            </div>
          </Col>

          {/* Cột phải: Thanh tìm kiếm & Danh sách tour */}
          <Col xs={24} lg={18} xl={19} className="tour-page__content">
            {/* Nút hiển thị bộ lọc dạng Drawer trên Mobile/Tablet */}
            <div className="tour-page__mobile-filter-bar">
              <Button
                type="primary"
                icon={<SlidersOutlined />}
                onClick={() => setDrawerOpen(true)}
                className="tour-page__mobile-filter-btn"
              >
                {t("filter.searchFilter")}
              </Button>
            </div>

            <div className="tour-page__search">
              <HeaderSearch />
            </div>
            <div className="tour-page__results">
              <TourListResults onPriceRangeUpdate={handlePriceRangeUpdate} />
            </div>
          </Col>
        </Row>
      </div>

      {/* Drawer chứa SidebarFilter cho màn hình Tablet/Mobile */}
      <Drawer
        title={
          <span>
            <SlidersOutlined /> {t("filter.searchFilter")}
          </span>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={300}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: "20px 24px" }}>
          <SidebarFilter priceRange={priceRange} />
        </div>
      </Drawer>
    </div>
  );
}

export default ToursAll;
