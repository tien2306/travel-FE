import React, { useState } from "react";
import { Row, Col, Drawer, Button } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import SidebarFilter from "../../../components/Client/ToursAll/SidebarFilter";
import HeaderSearch from "../../../components/Client/ToursAll/HeaderSearch";
import TourListResults from "../../../components/Client/ToursAll/TourListResults";
import "./ToursAll.scss";

function ToursAll() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation("tours");

  return (
    <div className="tour-page">
      <div className="tour-page__container">
        <Row gutter={[24, 24]}>
          {/* Cột trái: Bộ lọc */}
          <Col xs={0} lg={6} xl={5} className="tour-page__sidebar-col">
            <SidebarFilter />
          </Col>

          {/* Cột phải: Thanh tìm kiếm & Danh sách tour */}
          <Col xs={24} lg={18} xl={19} className="tour-page__content">
            {/* Nút hiển thị bộ lọc dạng Drawer trên Mobile/Tablet */}
            <div className="tour-page__mobile-filter-bar">
              <Button
                type="primary"
                icon={<SlidersOutlined />}
                onClick={() => setDrawerOpen(true)}
                className="tour-page__mobile-filter-btn"
              >
                {t("filter.searchFilter")}
              </Button>
            </div>

            <div className="tour-page__search">
              <HeaderSearch />
            </div>
            <div className="tour-page__results">
              <TourListResults />
            </div>
          </Col>
        </Row>
      </div>

      {/* Drawer chứa SidebarFilter cho màn hình Tablet/Mobile */}
      <Drawer
        title={
          <span>
            <SlidersOutlined /> {t("filter.searchFilter")}
          </span>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size={320}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: "20px 24px" }}>
          <SidebarFilter />
        </div>
      </Drawer>
    </div>
  );
}

export default ToursAll;
