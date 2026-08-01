import React from "react";
import { Select } from "antd";
import { AppstoreOutlined, MenuOutlined } from "@ant-design/icons";

export default function TourResultsToolbar({
  t,
  totalItems,
  params,
  handleSortChange,
  isMobile,
  viewMode,
  setViewMode,
}) {
  return (
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
            params.sortBy === "price" ? `price-${params.sortOrder}` : "default"
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
  );
}
