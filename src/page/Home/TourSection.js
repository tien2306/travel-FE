import React from "react";
import { Row, Col } from "antd";
import SidebarFilter from "../../components/SidebarFilter";
import HeaderSearch from "../../components/HeaderSearch";
import TourListResults from "../../components/TourListResults";
import "./tour.scss";

function TourSection() {
  return (
    <div className="tour-page">
      <div className="tour-page__container">
        <Row gutter={[24, 24]}>
          {/* Cột trái: Bộ lọc (chiếm 5 phần để tối ưu không gian bên phải) */}
          <Col xs={24} lg={5}>
            <SidebarFilter />
          </Col>

          {/* Cột phải: Thanh tìm kiếm & Danh sách tour */}
          <Col xs={24} lg={19} className="tour-page__content">
            <div className="tour-page__search">
              <HeaderSearch />
            </div>
            <div className="tour-page__results">
              <TourListResults />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default TourSection;
