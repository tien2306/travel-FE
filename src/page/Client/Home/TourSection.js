import React, { useState } from "react";
import { Row, Col, Drawer, Button } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import SidebarFilter from "../../../components/Client/SidebarFilter";
import HeaderSearch from "../../../components/Client/HeaderSearch";
import TourListResults from "../../../components/Client/TourListResults";
import "./tour.scss";

function TourSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="tour-page">
      <div className="tour-page__container">
        <Row gutter={[24, 24]}>
          {/* Cột trái: Bộ lọc (Ở màn hình to hiển thị dạng cột lg={6} hoặc xl={5}, màn hình md trở xuống ẩn đi) */}
          <Col xs={0} lg={6} xl={5}>
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
                Bộ lọc tìm kiếm
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
            <SlidersOutlined /> Bộ lọc tìm kiếm
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

export default TourSection;
