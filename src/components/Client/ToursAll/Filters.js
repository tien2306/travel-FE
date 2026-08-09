import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button, Checkbox, Select, Slider } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useFilterParams } from "../../../hooks/useFilterParams";
import { useSidebarAnimation } from "../../../page/Client/Tours/animations";
import { formatPrice } from "../../../helpers/format/format";
import "./Filters.scss";

function Filters({ onSearchSubmit, priceRange }) {
  const { t } = useTranslation("tours");
  const containerRef = useRef(null);
  useSidebarAnimation(containerRef);
  const { params, updateParams } = useFilterParams();
  const minBoundary = priceRange?.min;
  const maxBoundary = priceRange?.max;

  const getInitialBudget = useCallback(() => {
    const min =
      typeof params.minPrice === "number" && !isNaN(params.minPrice)
        ? params.minPrice
        : minBoundary;
    const max =
      typeof params.maxPrice === "number" && !isNaN(params.maxPrice)
        ? params.maxPrice
        : maxBoundary;
    return [min, max];
  }, [params.minPrice, params.maxPrice, minBoundary, maxBoundary]);

  const [budget, setBudget] = useState(getInitialBudget());

  useEffect(() => {
    setBudget(getInitialBudget());
  }, [getInitialBudget]);

  const handleArrayFilterChange = (e, key, itemValue) => {
    let currentValues = params[key] ? params[key].split(",") : [];

    if (e.target.checked) {
      if (!currentValues.includes(itemValue)) currentValues.push(itemValue);
    } else {
      currentValues = currentValues.filter((v) => v !== itemValue);
    }

    const databaseUpdate = {};
    if (currentValues.length > 0) {
      databaseUpdate[key] = currentValues.join(",");
    } else {
      databaseUpdate[key] = "";
    }
    updateParams(databaseUpdate);
  };

  const handleBudgetChangeCommitted = (value) => {
    updateParams({ minPrice: value[0], maxPrice: value[1], page: 1 });
  };

  const handleReset = () => {
    const resetValues = {};
    Object.keys(params).forEach((key) => {
      resetValues[key] = "";
    });

    updateParams({ ...resetValues, page: 1 });

    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  const isFiltered = Object.keys(params).some((key) => {
    if (key === "page" || key === "limit") return false;

    if (key === "minPrice") {
      const minVal = Number(params[key]);
      return minVal > 0 && minVal > (priceRange?.min || 0);
    }

    if (key === "maxPrice") {
      const maxVal = Number(params[key]);
      return maxVal < 400000000 && maxVal < (priceRange?.max || 200000000);
    }

    return (
      params[key] !== "" && params[key] !== undefined && params[key] !== null
    );
  });

  return (
    <div className="tour-filter" ref={containerRef}>
      <div className="tour-filter__header">
        <span className="tour-filter__title">
          <SlidersOutlined /> {t("filter.title")}
        </span>
        <Button
          type="link"
          className="tour-filter__reset-btn"
          onClick={handleReset}
          disabled={!isFiltered}
        >
          {t("filter.reset")}
        </Button>
      </div>

      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("search.departure", "Điểm khởi hành")}</span>
        <Select
          className="tour-filter__departure-select"
          popupClassName="tour-filter__departure-dropdown"
          placeholder={t("filter.selectDeparture", "Chọn điểm khởi hành")}
          allowClear
          value={params.departurePlace || undefined}
          onChange={(value) =>
            updateParams({ departurePlace: value || "", page: 1 })
          }
          options={[
            { value: "Hà Nội", label: t("filter.destHanoi") },
            { value: "TP.HCM", label: t("filter.destHcm") },
            { value: "Đà Nẵng", label: t("filter.destDanang") },
            { value: "Nha Trang", label: t("filter.destNhatrang") },
            { value: "Đà Lạt", label: t("filter.destDalat") },
            { value: "Phú Quốc", label: t("filter.destPhuquoc") },
            { value: "Hạ Long", label: t("filter.destHalong") },
            { value: "Sapa", label: t("filter.destSapa") },
            { value: "Quy Nhơn", label: t("filter.destQuynhon") },
            { value: "Huế", label: t("filter.destHue") },
          ]}
        />
      </div>

      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.category")}</span>
        <div className="tour-filter__checkbox-list">
          <Checkbox
            checked={params.category?.includes("STANDARD")}
            onChange={(e) => handleArrayFilterChange(e, "category", "STANDARD")}
          >
            {t("filter.catStandard")}
          </Checkbox>
          <Checkbox
            checked={params.category?.includes("PREMIUM")}
            onChange={(e) => handleArrayFilterChange(e, "category", "PREMIUM")}
          >
            {t("filter.catPremium")}
          </Checkbox>
          <Checkbox
            checked={params.category?.includes("SAVING")}
            onChange={(e) => handleArrayFilterChange(e, "category", "SAVING")}
          >
            {t("filter.catSaving")}
          </Checkbox>
          <Checkbox
            checked={params.category?.includes("ECONOMY")}
            onChange={(e) => handleArrayFilterChange(e, "category", "ECONOMY")}
          >
            {t("filter.catEconomy")}
          </Checkbox>
        </div>
      </div>

      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.transport")}</span>
        <div className="tour-filter__checkbox-list">
          <Checkbox
            checked={params.transport?.includes("PLANE")}
            onChange={(e) => handleArrayFilterChange(e, "transport", "PLANE")}
          >
            {t("filter.transFlight")}
          </Checkbox>
          <Checkbox
            checked={params.transport?.includes("BUS")}
            onChange={(e) => handleArrayFilterChange(e, "transport", "BUS")}
          >
            {t("filter.transBus")}
          </Checkbox>
          <Checkbox
            checked={params.transport?.includes("MOTORBIKE")}
            onChange={(e) =>
              handleArrayFilterChange(e, "transport", "MOTORBIKE")
            }
          >
            {t("filter.transMotorbike")}
          </Checkbox>
        </div>
      </div>

      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.budget")}</span>
        <Slider
          range
          min={minBoundary}
          max={maxBoundary}
          value={budget}
          onChange={(val) => setBudget(val)}
          onAfterChange={handleBudgetChangeCommitted}
          tooltip={{ formatter: (v) => formatPrice(v) }}
        />
        <div className="tour-filter__price-range">
          <span>{formatPrice(budget[0])}</span>
          <span>{formatPrice(budget[1])}</span>
        </div>
      </div>
    </div>
  );
}

export default Filters;
