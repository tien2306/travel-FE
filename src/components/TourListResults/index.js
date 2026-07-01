import React, { useEffect, useRef, useState } from "react";
import { Select, Spin } from "antd";
import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
import { getTour } from "../../services/tourService";
import TourGrid from "./TourGrid";
import TourList from "./TourList";
import TourPagination from "./TourPagination";
import "./TourListResults.scss";

export default function TourListResults() {
  const [viewMode, setViewMode] = useState("grid");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const tourListRef = useRef(null);

  const fetchApi = async (page) => {
    setLoading(true);
    try {
      const res = await getTour(page);
      if (res && res.success && res.data.items) {
        setTours(res.data.items);
        setTotalItems(res.data.pagination.total);
        setPageSize(res.data.pagination.limit);
      }
    } catch (error) {
      console.error("Lỗi fetch tours:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Thêm dấu hỏi chấm (?) sau tourListRef.current để tránh lỗi crash ứng dụng nếu ref chưa kịp nhận phần tử
    tourListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={tourListRef} className="tour-results">
      {/* TOOLBAR DUY NHẤT CỦA CẢ HỆ THỐNG NẰM Ở ĐÂY */}
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

      {/* HIỂN THỊ NỘI DUNG */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" description="Đang tải dữ liệu..." />
        </div>
      ) : viewMode === "grid" ? (
        <TourGrid data={tours} />
      ) : (
        <TourList data={tours} />
      )}

      {/* PHÂN TRANG */}
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
