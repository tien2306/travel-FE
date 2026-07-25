import React, { useRef, useState } from "react";
import { DatePicker, Button, Input } from "antd";
import { useFilterParams } from "../../../hooks/useFilterParams";
import {
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useSearchAnimation } from "../../../page/Client/Tours/animations";
import "./HeaderSearch.scss";

export default function HeaderSearch({ onSearchSubmit }) {
  const containerRef = useRef(null);
  const { t } = useTranslation("tours");
  useSearchAnimation(containerRef);
  const { params, updateParams } = useFilterParams();
  const [departure, setDeparture] = useState(params.departurePlace || "");
  const [keyword, setKeyword] = useState(params.keyword || "");
  const [date, setDate] = useState(
    params.startDate ? dayjs(params.startDate) : dayjs("2026-06-13"),
  );

  const handleSearch = () => {
    updateParams({
      departurePlace: departure,
      keyword: keyword,
      startDate: date ? date.format("YYYY-MM-DD") : "",
      page: 1,
    });

    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className="tour-search" ref={containerRef}>
      {/* KHỐI 1: ĐIỂM KHỞI HÀNH */}
      <div className="tour-search__section">
        <div className="tour-search__icon-box">
          <EnvironmentOutlined />
        </div>
        <div className="tour-search__field">
          <span className="tour-search__label">{t("search.departure")}</span>
          <Input
            variant="borderless"
            placeholder={t("search.anyLocation")}
            allowClear
            className="tour-search__input"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
            value={date}
            onChange={(val) => setDate(val)}
            allowClear={true}
            className="tour-search__picker"
          />
        </div>
      </div>

      <div className="tour-search__action">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className="tour-search__submit-btn"
          onClick={handleSearch}
        >
          {t("search.button")}
        </Button>
      </div>
    </div>
  );
}
