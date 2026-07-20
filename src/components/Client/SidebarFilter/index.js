import React, { useRef } from "react";
import { Switch, Select, Checkbox, Slider, Button } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import { useSidebarAnimation } from "../../../page/Client/Tours/animations";
import "./SidebarFilter.scss";

export default function SidebarFilter() {
  const containerRef = useRef(null);
  useSidebarAnimation(containerRef);

  return (
    <div className="tour-filter" ref={containerRef}>
      {/* Tiêu đề bộ lọc */}
      <div className="tour-filter__header">
        <span className="tour-filter__title">
          <SlidersOutlined /> Bộ lọc
        </span>
        <Button type="link" className="tour-filter__reset-btn">
          Đặt lại
        </Button>
      </div>

      {/* Switch ESG & LEI */}
      <div className="tour-filter__section tour-filter__section--flex">
        <span className="tour-filter__label-switch">ESG & LEI</span>
        <Switch size="small" />
      </div>

      {/* Điểm đến Dropdown */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">Điểm đến</span>
        <Select
          placeholder="Chọn điểm đến"
          style={{ width: "100%" }}
          allowClear
        />
      </div>

      {/* Điểm tham quan Dropdown */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">Điểm tham quan</span>
        <Select
          placeholder="Chọn điểm tham quan"
          style={{ width: "100%" }}
          allowClear
        />
      </div>

      {/* Nhóm lọc Dòng tour */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">Dòng tour</span>
        <div className="tour-filter__checkbox-list">
          <Checkbox>Tiêu chuẩn (8)</Checkbox>
          <Checkbox>Giá tốt (6)</Checkbox>
          <Checkbox>Tiết kiệm (4)</Checkbox>
          <Checkbox>Tour ESG & LEI (1)</Checkbox>
        </div>
      </div>

      {/* Nhóm lọc Phương tiện */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">Phương tiện</span>
        <div className="tour-filter__checkbox-list">
          <Checkbox>Máy bay (15)</Checkbox>
          <Checkbox>Xe (4)</Checkbox>
        </div>
      </div>

      {/* Lọc khoảng Ngân sách */}
      <div className="tour-filter__section">
        <span className="tour-filter__label">Ngân sách</span>
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
