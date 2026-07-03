import React, { useEffect, useRef, useState, useCallback } from "react"; // 1. Thêm useCallback ở đây
import { Select, Spin } from "antd";
import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";

import TourGrid from "./TourGrid";
import TourList from "./TourList";
import TourPagination from "./TourPagination";
import "./TourListResults.scss";
import { getTour } from "../../../services/tourService";

export default function TourListResults() {
  const [viewMode, setViewMode] = useState("grid"); // Chế độ Grid/List
  const [tours, setTours] = useState([]); // Tour
  const [loading, setLoading] = useState(false); //Loading
  const [currentPage, setCurrentPage] = useState(1); //Trang hiện tại
  const [totalItems, setTotalItems] = useState(0); // Tổng số tour
  const [pageSize, setPageSize] = useState(10); // Tổng số trang
  const tourListRef = useRef(null); //Lưu ví trí load lại khi click vào pagination

  // useCallback để tránh bị khởi tạo lại khi Layout re-render
  const fetchApi = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await getTour(page);
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

  // Chạy chuẩn xác theo currentPage
  useEffect(() => {
    fetchApi(currentPage);
  }, [currentPage, fetchApi]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    tourListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
