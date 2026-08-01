import React from "react";
import { Checkbox } from "antd";

export default function TransportFilter({ t, params, handleArrayFilterChange }) {
  return (
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
          onChange={(e) => handleArrayFilterChange(e, "transport", "MOTORBIKE")}
        >
          {t("filter.transMotorbike")}
        </Checkbox>
      </div>
    </div>
  );
}
