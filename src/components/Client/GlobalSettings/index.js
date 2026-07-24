import React, { useState } from "react";
import { Popover, Select } from "antd";
import { GlobalOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../../store/slices/languageSlice";
import "./GlobalSettings.scss";

const { Option } = Select;

// mã SVG cờ Việt Nam
const VietnamFlag = () => (
  <svg
    xmlns="http://w3.org"
    viewBox="0 0 900 600"
    width="18"
    height="18"
    preserveAspectRatio="xMidYMid slice"
    style={{ borderRadius: "50%", display: "block" }}
  >
    <rect fill="#da251d" width="900" height="600" />
    <polygon fill="#ffff00" points="450,195 520,405 340,275 560,275 380,405" />
  </svg>
);

function GlobalSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentLanguage } = useSelector((state) => state.languageReducer);

  const handleLanguageChange = (value) => {
    dispatch(changeLanguage(value));
    setIsOpen(false);
  };

  const handleCurrencyChange = (value) => {
    setIsOpen(false);
  };

  const popoverContent = (
    <div className="global-settings-popover">
      <div className="global-settings-popover__header">
        <span className="global-settings-popover__title">CÀI ĐẶT</span>
        <CloseOutlined
          className="global-settings-popover__close"
          onClick={() => setIsOpen(false)}
        />
      </div>
      <div className="global-settings-popover__group">
        <label className="global-settings-popover__label">NGÔN NGỮ</label>
        <Select
          value={currentLanguage}
          style={{ width: "100%" }}
          onChange={handleLanguageChange}
          className="global-settings-popover__select"
          popupMatchSelectWidth={false}
          placement="bottomRight"
        >
          <Option value="vi">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <VietnamFlag />
              Tiếng Việt
            </div>
          </Option>
          <Option value="en">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <GlobalOutlined style={{ fontSize: "18px" }} /> English
            </div>
          </Option>
        </Select>
      </div>

      <div className="global-settings-popover__group">
        <label className="global-settings-popover__label">TIỀN TỆ</label>
        <Select
          defaultValue="VND"
          style={{ width: "100%" }}
          onChange={handleCurrencyChange}
          className="global-settings-popover__select"
          popupMatchSelectWidth={false}
          placement="bottomRight"
        >
          <Option value="VND">₫ VND</Option>
          <Option value="USD">$ USD</Option>
        </Select>
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      placement="bottomRight"
      open={isOpen}
      onOpenChange={setIsOpen}
      overlayClassName="global-settings-overlay"
    >
      <div className="global-settings__trigger">
        {currentLanguage === "vi" ? (
          <VietnamFlag />
        ) : (
          <GlobalOutlined
            className="global-settings__icon"
            style={{ fontSize: "18px" }}
          />
        )}
        <span className="global-settings__text">
          {currentLanguage === "vi" ? "VN" : "EN"}
        </span>
      </div>
    </Popover>
  );
}

export default GlobalSettings;
