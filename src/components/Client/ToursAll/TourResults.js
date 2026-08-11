import React, { useEffect, useRef, useState, useCallback } from "react";
import { Spin, Select, Pagination } from "antd";
import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getToursFilter } from "../../../services/tour";
import { useFilterParams } from "../../../hooks/useFilterParams";
import TourGrid from "./TourGrid";
import TourList from "./TourList";
import { useTourListAnimation } from "../../../page/Client/Tours/animations";
import { useResponsive } from "../../../hooks/useResponsive";
import "./TourResults.scss";

function TourResults({ onPriceRangeUpdate }) {
  const { t } = useTranslation("tours");
  const [viewMode, setViewMode] = useState("grid");
  
  const windowWidth = useResponsive();
  const isMobile = windowWidth <= 768; //dùng để kt màn đth nhỏ hơn 768 -> true

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const tourListRef = useRef(null);

  useTourListAnimation(tourListRef, tours, loading);

  const { params, updateParams } = useFilterParams();
  const currentPage = params.page || 1;

  const handlePageChange = (page) => {
    updateParams({ page: page });
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
        setTours([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi fetch tours:", error);
    } finally {
      setLoading(false);
    }
  }, [params, onPriceRangeUpdate]);

  // xử lí khi scroll ở trang home ấn filter hoặc search
  useEffect(() => {
    if (window.location.search && tourListRef.current) {
      setTimeout(() => {
        tourListRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, []);

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
          {!isMobile && (
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
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      ) : !isMobile && viewMode === "grid" ? (
        <TourGrid data={tours} />
      ) : (
        <TourList data={tours} />
      )}

      {!loading && totalItems > pageSize && (
        <div className="tour-results__pagination-wrapper">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger={false}
            responsive
          />
        </div>
      )}
    </div>
  );
}

export default TourResults;
