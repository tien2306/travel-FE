import React, { useEffect, useRef, useState, useCallback } from "react";
import { Select, Spin } from "antd";
import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTours } from "../../../services/tour";
import TourGrid from "./TourGrid";
import TourList from "./TourList";
import TourPagination from "./TourPagination";
import "./TourListResults.scss";
import "./TourCard.scss";

export default function TourListResults() {
  const [viewMode, setViewMode] = useState("grid"); //Lưu chế độ
  const [tours, setTours] = useState([]); // Lưu data tour
  const [loading, setLoading] = useState(false); // Chế độ loading
  const [totalItems, setTotalItems] = useState(0); // Tổng số tour
  const [pageSize, setPageSize] = useState(10); // Tổng số trang
  const tourListRef = useRef(null); //Lưu ví trí load lại khi click vào pagination
  const navigate = useNavigate();

  // Đọc  dữ liệu URL
  const [searchParams] = useSearchParams();
  // searchParams (Đọc dữ liệu): là một Object, một đối tượng đặc biệt (gọi là URLSearchParams instance).
  // để đọc đc bắt buộc phải dùng các hàm đi kèm  vd: searchParams.get(key)
  // setSearchParams (Ghi/Sửa dữ liệu): Hàm này dùng để đổi chữ trên URL, ép trình duyệt nhảy sang URL mới mà không làm tải lại trang (no-reload).

  // Có 2 cách chính để truyền dữ liệu vào hàm này:
  // Cách 1:
  // URL cũ: ?sort=asc&color=red
  // setSearchParams({ page: "2" });
  // URL mới: ?page=2 (Mất sạch sort và color cũ!)

  // .get(key) lấy 1 giá trị từ key
  // .getAll(key) lấy toàn bộ giá trị từ key
  // .has(key) KT tham số đó có tồn tại trên URL ?

  // Cách 2:
  // Xử lý khi bấm nút chuyển trang trên Antd Pagination
  const handlePageChange = (page) => {
    // 1. Tạo một bản sao từ các tham số hiện tại trên URL
    const newParams = new URLSearchParams(searchParams);

    // 2. Thêm hoặc cập nhật số trang mới vào bản sao đó
    newParams.set("page", page.toString());

    // 3. Đổi hướng thẳng về "/tours" kèm theo các tham số mới (Gộp cả 2 trường hợp if/else cũ)
    navigate(`/tours?${newParams.toString()}`);

    // 4. Cuộn mượt mà lên đầu danh sách
    tourListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Đọc số trang từ URL trình duyệt (ví dụ: localhost:3000/tours?page=2 -> lấy ra số 2)
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Giữ nguyên hàm giữa các lần render
  const fetchApi = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await getTours(page);
      if (res && res.success && res.data?.items) {
        setTours(res.data.items);
        setTotalItems(res.data.pagination.total);
        setPageSize(res.data.pagination.limit);
      }
    } catch (error) {
      console.error("Lỗi fetch tours:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lắng nghe URL trình duyệt: Cứ hễ URL thay đổi số trang là gọi lại API lấy dữ liệu mới
  useEffect(() => {
    fetchApi(currentPage);
  }, [currentPage, fetchApi]);

  return (
    <div ref={tourListRef} className="tour-results">
      <div className="tour-results__toolbar">
        <div className="tour-results__count">
          Kết quả: <span>{totalItems} chương trình tour</span>
        </div>
        <div className="tour-results__actions">
          <span className="tour-results__sort-label">Sắp xếp theo:</span>
          <Select
            defaultValue="date-asc"
            className="tour-results__sort-select"
            variant="filled"
          >
            <Select.Option value="date-asc">
              Ngày khởi hành gần nhất
            </Select.Option>
          </Select>
          <div className="tour-results__view-modes">
            <AppstoreOutlined
              className={`tour-results__icon ${viewMode === "grid" ? "tour-results__icon--active" : ""}`}
              onClick={() => setViewMode("grid")}
            />
            <MenuOutlined
              className={`tour-results__icon ${viewMode === "list" ? "tour-results__icon--active" : ""}`}
              onClick={() => setViewMode("list")}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : viewMode === "grid" ? (
        <TourGrid data={tours} />
      ) : (
        <TourList data={tours} />
      )}

      {!loading && totalItems > pageSize && (
        <TourPagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}
