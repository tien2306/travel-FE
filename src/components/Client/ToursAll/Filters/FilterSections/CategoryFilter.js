import React from "react";
import { Checkbox } from "antd";

export default function CategoryFilter({ t, params, handleArrayFilterChange }) {
  return (
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
  );
}
