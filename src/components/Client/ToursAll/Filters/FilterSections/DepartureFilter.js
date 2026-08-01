import React from "react";
import { Select } from "antd";

export default function DepartureFilter({ params, updateParams }) {
  return (
    <div className="tour-filter__section">
      <span className="tour-filter__label">Điểm khởi hành</span>
      <Select
        className="tour-filter__departure-select"
        popupClassName="tour-filter__departure-dropdown"
        placeholder="Chọn điểm khởi hành"
        allowClear
        value={params.departurePlace || undefined}
        onChange={(value) => updateParams({ departurePlace: value || "", page: 1 })}
        options={[
          { value: "Hà Nội", label: "Hà Nội" },
          { value: "TP.HCM", label: "TP.HCM" },
          { value: "Đà Nẵng", label: "Đà Nẵng" },
          { value: "Nha Trang", label: "Nha Trang" },
          { value: "Đà Lạt", label: "Đà Lạt" },
          { value: "Phú Quốc", label: "Phú Quốc" },
          { value: "Hạ Long", label: "Hạ Long" },
          { value: "Sapa", label: "Sapa" },
          { value: "Quy Nhơn", label: "Quy Nhơn" },
          { value: "Huế", label: "Huế" }
        ]}
      />
    </div>
  );
}
