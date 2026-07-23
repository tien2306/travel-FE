import React, { useRef } from "react";
import { Switch, Select, Checkbox, Slider, Button } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSidebarAnimation } from "../../../page/Client/Tours/animations";
import "./SidebarFilter.scss";

export default function SidebarFilter() {
  const containerRef = useRef(null);
  const { t } = useTranslation("tours");
  useSidebarAnimation(containerRef);

  return (
    <div className="tour-filter" ref={containerRef}>
      {/* Tiêu đề bộ lọc */}
      <div className="tour-filter__header">
        <span className="tour-filter__title">
          <SlidersOutlined /> {t("filter.title")}
        </span>
        <Button type="link" className="tour-filter__reset-btn">
          {t("filter.reset")}
        </Button>
      </div>

      {/* Switch ESG & LEI */}
      <div className="tour-filter__section tour-filter__section--flex">
        <span className="tour-filter__label-switch">ESG & LEI</span>
        <Switch size="small" />
      </div>

      {/* Điểm đến Dropdown */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.destination")}</span>
        <Select
          placeholder={t("filter.selectDestination")}
          style={{ width: "100%" }}
          allowClear
        />
      </div>

      {/* Điểm tham quan Dropdown */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.attractions")}</span>
        <Select
          placeholder={t("filter.selectAttraction")}
          style={{ width: "100%" }}
          allowClear
        />
      </div>

      {/* Nhóm lọc Dòng tour */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.category")}</span>
        <div className="tour-filter__checkbox-list">
          <Checkbox>{t("filter.catStandard")} (8)</Checkbox>
          <Checkbox>{t("filter.catBestPrice")} (6)</Checkbox>
          <Checkbox>{t("filter.catEconomy")} (4)</Checkbox>
          <Checkbox>{t("filter.catEsg")} (1)</Checkbox>
        </div>
      </div>

      {/* Nhóm lọc Phương tiện */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.transport")}</span>
        <div className="tour-filter__checkbox-list">
          <Checkbox>{t("filter.transFlight")} (15)</Checkbox>
          <Checkbox>{t("filter.transBus")} (4)</Checkbox>
        </div>
      </div>

      {/* Lọc khoảng Ngân sách */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">{t("filter.budget")}</span>
        <Slider
          range
          min={3990000}
          max={14990000}
          defaultValue={[3990000, 14990000]}
          tooltip={{ formatter: (v) => `${v.toLocaleString()}đ` }}
        />
        <div className="tour-filter__price-range">
          <span>3.990.000đ</span>
          <span>14.990.000đ</span>
        </div>
      </div>
    </div>
  );
}
