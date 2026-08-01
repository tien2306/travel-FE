import React from "react";
import { Slider } from "antd";

export default function BudgetFilter({
  t,
  minBoundary,
  maxBoundary,
  budget,
  setBudget,
  handleBudgetChangeCommitted,
}) {
  return (
    <div className="tour-filter__section">
      <span className="tour-filter__label">{t("filter.budget")}</span>
      <Slider
        range
        min={minBoundary}
        max={maxBoundary}
        value={budget}
        onChange={(val) => setBudget(val)}
        onAfterChange={handleBudgetChangeCommitted}
        tooltip={{ formatter: (v) => `${v.toLocaleString()}đ` }}
      />
      <div className="tour-filter__price-range">
        <span>{budget[0].toLocaleString()}đ</span>
        <span>{budget[1].toLocaleString()}đ</span>
      </div>
    </div>
  );
}
