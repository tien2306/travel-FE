import React, { useEffect, useRef, useState, useCallback } from "react";
import { Select, Spin } from "antd";
import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getToursFilter } from "../../../services/tour";
import { useFilterParams } from "../../../hooks/useFilterParams";
import TourGrid from "./TourGrid";
import TourList from "./TourList";
import TourPagination from "./TourPagination";
import { useTourListAnimation } from "../../../page/Client/Tours/animations";
import "./TourListResults.scss";
import "./TourCard.scss";

export default function TourListResults({ onPriceRangeUpdate }) {
  const [viewMode, setViewMode] = useState("grid"); //Lưu chế độ
  const [tours, setTours] = useState([]); // Lưu data tour
  const [loading, setLoading] = useState(false); // Chế độ loading
  const [totalItems, setTotalItems] = useState(0); // Tổng số tour
  const [pageSize, setPageSize] = useState(10); // Tổng số trang
  const tourListRef = useRef(null); //Lưu ví trí load lại khi click vào pagination
  const { t } = useTranslation("tours");

  useTourListAnimation(tourListRef, tours, loading);

  const { params, updateParams } = useFilterParams();

  const handlePageChange = (page) => {
    updateParams({ page });

    // Cuộn mượt mà đến đầu danh sách Tour
    setTimeout(() => {
      if (tourListRef.current) {
        tourListRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  const handleSortChange = (value) => {
    if (value === "price-asc") {
      updateParams({ sortBy: "price", sortOrder: "asc", page: 1 });
    } else if (value === "price-desc") {
      updateParams({ sortBy: "price", sortOrder: "desc", page: 1 });
    } else {
      updateParams({ sortBy: "", sortOrder: "", page: 1 });
    }
  };

  // Đọc số trang từ biến params
  const currentPage = params.page || 1;

  const fetchApi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getToursFilter(params);

      if (res && res.success) {
        setTours(res.data);
        setTotalItems(res.pagination?.total || 0);
        setPageSize(res.pagination?.limit || 12);
        if (res.priceRange && onPriceRangeUpdate) {
          onPriceRangeUpdate(res.priceRange);
        }
      } else {
        // Xử lý trường hợp không có data
        setTours([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi fetch tours:", error);
    } finally {
      setLoading(false);
    }
  }, [params, onPriceRangeUpdate]);

  // Tự động cuộn đến danh sách Tour khi vừa chuyển từ trang Home sang
  useEffect(() => {
    // Chỉ cuộn nếu có URL parameters (nghĩa là user vừa search/filter từ trang khác sang)
    if (window.location.search && tourListRef.current) {
      setTimeout(() => {
        tourListRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, []);

  // Lắng nghe URL trình duyệt: Cứ hễ URL thay đổi là gọi lại API (ko chỉ page mà cả sort, category...)
  useEffect(() => {
    fetchApi();
  }, [params, fetchApi]);

  return (
    <div ref={tourListRef} className="tour-results">
      <div className="tour-results__toolbar">
        <div className="tour-results__count">
          {t("results.count")}{" "}
          <span>
            {totalItems} {t("results.programs")}
          </span>
        </div>
        <div className="tour-results__actions">
          <span className="tour-results__sort-label">
            {t("results.sortBy")}
          </span>
          <Select
            value={
              params.sortBy === "price"
                ? `price-${params.sortOrder}`
                : "default"
            }
            className="tour-results__sort-select"
            variant="filled"
            onChange={handleSortChange}
          >
            <Select.Option value="default">{t("results.sortBy")}</Select.Option>
            <Select.Option value="price-asc">
              {t("results.sortPriceAsc")}
            </Select.Option>
            <Select.Option value="price-desc">
              {t("results.sortPriceDesc")}
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
