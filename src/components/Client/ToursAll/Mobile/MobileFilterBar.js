import React from "react";
import { FloatButton, Dropdown } from "antd";
import {
  SlidersOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";

export default function MobileFilterBar({
  t,
  isVisible,
  menuOpen,
  setMenuOpen,
  setFilterDrawerOpen,
  setSearchDrawerOpen,
}) {
  return (
    <div className="tour-page__mobile-filter-bar">
      <Dropdown
        menu={{
          items: [
            {
              key: "filter",
              icon: <SlidersOutlined />,
              label: t("filter.title"),
              onClick: () => setFilterDrawerOpen(true),
            },
            {
              key: "search",
              icon: <SearchOutlined />,
              label: t("search.button"),
              onClick: () => setSearchDrawerOpen(true),
            },
          ],
        }}
        trigger={["click"]}
        placement="topLeft"
        open={menuOpen}
        onOpenChange={setMenuOpen}
      >
        <FloatButton
          type="primary"
          icon={<FilterOutlined />}
          style={{
            right: 24,
            bottom: 74,
            opacity: isVisible ? 1 : 0,
            visibility: isVisible ? "visible" : "hidden",
            pointerEvents: isVisible ? "auto" : "none",
            transition: "all 0.3s ease-in-out",
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        />
      </Dropdown>
    </div>
  );
}
