import React, { useRef } from "react";
import { Select, DatePicker, Button, Input } from "antd";
import { SearchOutlined, EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useSearchAnimation } from "../../../page/Client/Tours/animations";
import "./HeaderSearch.scss";

export default function HeaderSearch() {
  const containerRef = useRef(null);
  const { t } = useTranslation("tours");
  useSearchAnimation(containerRef);

  return (
    <div className="tour-search" ref={containerRef}>
      {/* KHỐI 1: ĐIỂM KHỞI HÀNH */}
      <div className="tour-search__section">
        <div className="tour-search__icon-box">
          <EnvironmentOutlined />
        </div>
        <div className="tour-search__field">
          <span className="tour-search__label">{t("search.departure")}</span>
          <Select
            variant="none"
            defaultValue="all"
            allowClear
            classNames={{ popup: { root: "tour-search__dropdown" } }}
          >
            <Select.Option value="all">{t("search.all")}</Select.Option>
            <Select.Option value="hcm">{t("search.hcm")}</Select.Option>
            <Select.Option value="hn">{t("search.hn")}</Select.Option>
          </Select>
        </div>
      </div>

      {/* KHỐI 2: ĐIỂM ĐẾN */}
      <div className="tour-search__section">
        <div className="tour-search__icon-box">
          <EnvironmentOutlined />
        </div>
        <div className="tour-search__field">
          <span className="tour-search__label">{t("search.destination")}</span>
          <Input
            variant="borderless"
            placeholder={t("search.anyLocation")}
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
          <span className="tour-search__label">{t("search.date")}</span>
          <DatePicker
            variant="none"
            format={t("search.dateFormat")}
            defaultValue={dayjs("2026-06-13")}
            allowClear={false}
            className="tour-search__picker"
          />
        </div>
      </div>

      <div className="tour-search__action">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="tour-search__submit-btn"
        >
          {t("search.button")}
        </Button>
      </div>
    </div>
  );
}
