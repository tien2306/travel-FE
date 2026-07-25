import React, { useRef, useState, useEffect, useCallback } from "react";
import { Checkbox, Slider, Button } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useFilterParams } from "../../../hooks/useFilterParams";
import { useSidebarAnimation } from "../../../page/Client/Tours/animations";
import "./SidebarFilter.scss";

export default function SidebarFilter({ onSearchSubmit, priceRange }) {
  const containerRef = useRef(null);
  const { t } = useTranslation("tours");
  useSidebarAnimation(containerRef);
  const { params, updateParams } = useFilterParams();

  const minBoundary = priceRange?.min;
  const maxBoundary = priceRange?.max;

  const getInitialBudget = useCallback(() => {
    const min =
      typeof params.minPrice === "number" && !isNaN(params.minPrice)
        ? params.minPrice
        : minBoundary;
    const max =
      typeof params.maxPrice === "number" && !isNaN(params.maxPrice)
        ? params.maxPrice
        : maxBoundary;
    return [min, max];
  }, [params.minPrice, params.maxPrice, minBoundary, maxBoundary]);

  const [budget, setBudget] = useState(getInitialBudget());

  useEffect(() => {
    setBudget(getInitialBudget());
  }, [getInitialBudget]);

  const handleArrayFilterChange = (e, key, itemValue) => {
    // BƯỚC 1: LẤY DỮ LIỆU HIỆN TẠI TRÊN URL BIẾN THÀNH MẢNG
    // Kiểm tra xem trên URL nhóm này (params[key]) đã có chữ nào chưa?
    // - Nếu CÓ: Cắt chuỗi chữ đó bằng dấu phẩy (split(",")) để biến thành một Mảng các lựa chọn.
    // - Nếu CHƯA CÓ: Tạo một Mảng rỗng [] làm gốc.
    let currentValues = params[key] ? params[key].split(",") : [];

    // BƯỚC 2: XỬ LÝ LOGIC THÊM HOẶC XÓA KHI NGƯỜI DÙNG TÁC ĐỘNG
    if (e.target.checked) {
      // Trường hợp 1: Người dùng TÍCH CHỌN ô (Hiện dấu v)
      // Nếu trong mảng hiện tại CHƯA có chữ này (!currentValues.includes(itemValue))
      // thì mới ném chữ này (itemValue) vào mảng (.push) để tránh bị trùng lặp dữ liệu.
      if (!currentValues.includes(itemValue)) currentValues.push(itemValue);
    } else {
      // Trường hợp 2: Người dùng BỎ TÍCH CHỌN ô (Xóa dấu v)
      // Dùng hàm .filter để duyệt qua mảng, giữ lại các chữ khác và ĐUỔI THẲNG CỔ chữ (itemValue) vừa bỏ tích ra ngoài.
      currentValues = currentValues.filter((v) => v !== itemValue);
    }

    // BƯỚC 3: CẬP NHẬT MẢNG DỮ LIỆU MỚI NÀY LÊN THANH ĐỊA CHỈ URL
    const databaseUpdate = {};
    if (currentValues.length > 0) {
      // Nếu mảng CÓ người chọn -> Dùng hàm join để nối các chữ lại bằng dấu phẩy
      // Sau đó dùng KEY ĐỘNG [key] để gán chuỗi đó vào Object
      databaseUpdate[key] = currentValues.join(",");
    } else {
      // Nếu mảng RỖNG TUẾCH -> Gán bằng chuỗi rỗng "" để tí nữa URL tự xóa chữ đó đi
      databaseUpdate[key] = "";
    }
    updateParams(databaseUpdate);
  };

  const handleBudgetChangeCommitted = (value) => {
    updateParams({ minPrice: value[0], maxPrice: value[1], page: 1 });
  };

  const handleReset = () => {
    // Tạo ra một Object trống trơn ban đầu
    const resetValues = {};
    // Dùng Object.keys để lấy ra mảng các tên biến hiện tại (Vd: ["page", "search", "minPrice"])
    // Sau đó dùng .forEach để duyệt qua từng tên biến một
    Object.keys(params).forEach((key) => {
      // Dùng KEY ĐỘNG để gán cho tất cả các ô này thành chuỗi rỗng ""
      resetValues[key] = "";
    });

    updateParams({ ...resetValues, page: 1 });

    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  // Kiểm tra xem người dùng có đang áp dụng bất kỳ bộ lọc nào không (bỏ qua 'page' và 'limit')
  const isFiltered = Object.keys(params).some((key) => {
    if (key === "page" || key === "limit") return false;

    if (key === "minPrice") {
      const minVal = Number(params[key]);
      return minVal > 0 && minVal > (priceRange?.min || 0);
    }

    if (key === "maxPrice") {
      const maxVal = Number(params[key]);
      return maxVal < 400000000 && maxVal < (priceRange?.max || 200000000);
    }

    return (
      params[key] !== "" && params[key] !== undefined && params[key] !== null
    );
  });

  return (
    <div className="tour-filter" ref={containerRef}>
      {/* Tiêu đề bộ lọc */}
      <div className="tour-filter__header">
        <span className="tour-filter__title">
          <SlidersOutlined /> {t("filter.title")}
        </span>
        <Button
          type="link"
          className="tour-filter__reset-btn"
          onClick={handleReset}
          disabled={!isFiltered}
        >
          {t("filter.reset")}
        </Button>
      </div>

      {/* Nhóm lọc Dòng tour */}
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

      {/* Nhóm lọc Phương tiện */}
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
            onChange={(e) =>
              handleArrayFilterChange(e, "transport", "MOTORBIKE")
            }
          >
            {t("filter.transMotorbike")}
          </Checkbox>
        </div>
      </div>

      {/* Lọc khoảng Ngân sách */}
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
    </div>
  );
}
