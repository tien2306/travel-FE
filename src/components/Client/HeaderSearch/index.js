import React, { useRef } from "react";
import { Select, DatePicker, Button, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSearchAnimation } from "../../../page/Client/Tours/animations";
import "./HeaderSearch.scss";

export default function HeaderSearch() {
  const containerRef = useRef(null);
  useSearchAnimation(containerRef);

  return (
    <div className="tour-search" ref={containerRef}>
      {/* KHỐI 1: ĐIỂM KHỞI HÀNH */}
      <div className="tour-search__section">
        <div className="tour-search__icon-box">
          <EnvironmentOutlined />
        </div>
        <div className="tour-search__field">
          <span className="tour-search__label">Điểm khởi hành</span>
          <Select
            variant="none"
            defaultValue="all"
            allowClear
            classNames={{ popup: { root: "tour-search__dropdown" } }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="hcm">TP. Hồ Chí Minh</Select.Option>
            <Select.Option value="hn">Hà Nội</Select.Option>
          </Select>
        </div>
      </div>

      {/* KHỐI 2: ĐIỂM ĐẾN */}
      <div className="tour-search__section">
        <div className="tour-search__icon-box">
          <EnvironmentOutlined />
        </div>
        <div className="tour-search__field">
          <span className="tour-search__label">Điểm đến</span>
          <Input
            variant="borderless"
            placeholder="Địa điểm bất kỳ..."
            allowClear
            className="tour-search__input"
          />
        </div>
      </div>

      {/* KHỐI 3: NGÀY ĐI */}
      <div className="tour-search__section">
        <div className="tour-search__icon-box">
          <CalendarOutlined />
        </div>
        <div className="tour-search__field">
          <span className="tour-search__label">Ngày đi</span>
          <DatePicker
            variant="none"
            format="DD thg MM, YYYY"
            defaultValue={dayjs("2026-06-13")}
            allowClear={false}
            className="tour-search__picker"
          />
        </div>
      </div>

      {/* KHỐI 4: NÚT TÌM KIẾM (Đã đổi tên chữ) */}
      <div className="tour-search__action">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="tour-search__submit-btn"
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
