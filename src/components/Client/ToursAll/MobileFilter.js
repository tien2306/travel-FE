import React from "react";
import { Drawer, FloatButton, Dropdown } from "antd";
import {
  SlidersOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import Filters from "./Filters";
import HeaderSearch from "./HeaderSearch";

export function MobileDrawers({
  t,
  filterDrawerOpen,
  setFilterDrawerOpen,
  searchDrawerOpen,
  setSearchDrawerOpen,
  priceRange,
}) {
  return (
    <>
      <Drawer
        title={
          <span>
            <SlidersOutlined /> {t("filter.title")}
          </span>
        }
        placement="left"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        size={250}
        styles={{ body: { padding: 0 } }}
        rootClassName="tour-filter-drawer"
      >
        <div style={{ padding: "20px 24px" }}>
          <Filters
            onSearchSubmit={() => setFilterDrawerOpen(false)}
            priceRange={priceRange}
          />
        </div>
      </Drawer>

      <Drawer
        title={
          <span>
            <SearchOutlined /> {t("search.button")}
          </span>
        }
        placement="right"
        onClose={() => setSearchDrawerOpen(false)}
        open={searchDrawerOpen}
        size={250}
        styles={{ body: { padding: 0 } }}
        rootClassName="tour-search-drawer"
      >
        <div style={{ padding: "20px 24px" }}>
          <div className="tour-page__drawer-search">
            <HeaderSearch onSearchSubmit={() => setSearchDrawerOpen(false)} />
          </div>
        </div>
      </Drawer>
    </>
  );
}

export function MobileFilterBar({
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
