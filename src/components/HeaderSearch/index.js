import React from "react";
import { Select, DatePicker, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./HeaderSearch.scss";

export default function HeaderSearch() {
  return (
    <div className="tour-search">
      {/* KHỐI 1: LOẠI HÌNH TOUR */}
      <div className="tour-search__section tour-search__section--filter">
        <div className="tour-search__field">
          <span className="tour-search__label">Loại</span>
          <Select
            variant="none"
            defaultValue="all"
            classNames={{ popup: { root: "tour-search__dropdown" } }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="package">Tour trọn gói</Select.Option>
          </Select>
        </div>
      </div>

      {/* KHỐI 2: ĐIỂM KHỞI HÀNH */}
      <div className="tour-search__section">
        <div className="tour-search__field">
          <span className="tour-search__label">Điểm khởi hành</span>
          <Select
            variant="none"
            defaultValue="all"
            classNames={{ popup: { root: "tour-search__dropdown" } }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="hcm">TP. Hồ Chí Minh</Select.Option>
          </Select>
        </div>
      </div>

      {/* KHỐI 3: NGÀY ĐI */}
      <div className="tour-search__section">
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
