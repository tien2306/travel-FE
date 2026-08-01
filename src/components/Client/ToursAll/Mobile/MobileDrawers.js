import React from "react";
import { Drawer } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";
import SidebarFilter from "../Filters/SidebarFilter";
import HeaderSearch from "../Search/HeaderSearch";

export default function MobileDrawers({
  t,
  filterDrawerOpen,
  setFilterDrawerOpen,
  searchDrawerOpen,
  setSearchDrawerOpen,
  priceRange,
}) {
  return (
    <>
      {/*  Drawer là thanh trượt cạnh màn hình ra   */}
      {/* Drawer chứa SidebarFilter cho màn hình Tablet/Mobile */}
      <Drawer
        title={
          <span>
            <SlidersOutlined /> {t("filter.title")}
          </span>
        }
        placement="left"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={250}
        styles={{ body: { padding: 0 } }}
        rootClassName="tour-filter-drawer"
      >
        <div style={{ padding: "20px 24px" }}>
          <SidebarFilter
            onSearchSubmit={() => setFilterDrawerOpen(false)}
            priceRange={priceRange}
          />
        </div>
      </Drawer>

      {/* Drawer chứa HeaderSearch cho màn hình Tablet/Mobile */}
      <Drawer
        title={
          <span>
            <SearchOutlined /> {t("search.button")}
          </span>
        }
        placement="right"
        onClose={() => setSearchDrawerOpen(false)}
        open={searchDrawerOpen}
        width={250}
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
