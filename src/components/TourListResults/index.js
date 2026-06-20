import React, { useState } from "react";
import { Row, Col, Select, Card, Tag, Button } from "antd";
import {
  AppstoreOutlined,
  MenuOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BarcodeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import "./TourListResults.scss";

export default function TourListResults() {
  const [viewMode, setViewMode] = useState("grid");

  const tourData = [
    {
      id: 1,
      tag: "ESG & LEI",
      tagColor: "green",
      esgScore: "82",
      leiScore: "68",
      title: "Phú Quốc: Sun World Hòn Thơm Nature Park - Thị Trấn Hoàng Hôn",
      code: "NDNHA7950",
      depart: "Nha Trang",
      duration: "3 ngày 2 đêm",
      transport: "Máy bay",
      dates: ["16/06"],
      price: "5.990.000",
    },
    {
      id: 2,
      tag: "Giá tốt",
      tagColor: "red",
      esgScore: null,
      leiScore: null,
      title:
        "Phú Quốc: Hòn Thơm Nature Park - Thị Trấn Hoàng Hôn - Grand World Cáp Treo Vượt Biển Công Viên Nước Aquatopia",
      code: "NDSGN8741",
      depart: "TP. Hồ Chí Minh",
      duration: "3 ngày 2 đêm",
      transport: "Máy bay",
      dates: ["17/06", "28/06", "01/07", "05/07", "08/07", "12/07", "15/07"],
      price: "5.390.000",
    },
  ];

  return (
    <div className="tour-results">
      {/* 1. Toolbar công cụ */}
      <div className="tour-results__toolbar">
        <div className="tour-results__count">
          Kết quả: <span>19 chương trình tour</span>
        </div>
        <div className="tour-results__actions">
          <span className="tour-results__sort-label">Sắp xếp theo:</span>
          <Select
            defaultValue="date-asc"
            className="tour-results__sort-select"
            variant="filled"
          >
            <Select.Option value="date-asc">
              Ngày khởi hành gần nhất
            </Select.Option>
          </Select>

          <div className="tour-results__view-modes">
            <AppstoreOutlined
              className={`tour-results__icon ${viewMode === "grid" ? "tour-results__icon--active" : ""}`}
              onClick={() => setViewMode("grid")}
            />
            <MenuOutlined
              className={`tour-results__icon ${viewMode === "list" ? "tour-results__icon--active" : ""}`}
              onClick={() => setViewMode("list")}
            />
          </div>
        </div>
      </div>

      {/* 2. Lưới danh sách chứa các Card Tour */}
      <Row gutter={[20, 20]}>
        {tourData.map((tour) => (
          <Col
            span={viewMode === "grid" ? 8 : 24}
            key={tour.id}
            xs={24}
            md={viewMode === "grid" ? 12 : 24}
            lg={viewMode === "grid" ? 8 : 24}
          >
            <Card
              hoverable
              className={`tour-card ${viewMode === "list" ? "tour-card--list-mode" : ""}`}
            >
              <div className="tour-card__hero">
                <img
                  src={`https://media-cdn-v2.laodong.vn/storage/newsportal/2022/8/17/1081872/Hinh-2.jpg`}
                  alt="Tour"
                  className="tour-card__img"
                />
                <Tag
                  className={`tour-card__badge tour-card__badge--${tour.tagColor}`}
                >
                  {tour.tag}
                </Tag>
                {tour.esgScore && (
                  <div className="tour-card__score-bar">
                    <span>
                      ESG: {tour.esgScore} | LEI: {tour.leiScore}
                    </span>
                    <span className="tour-card__quick-view">👁 Xem nhanh</span>
                  </div>
                )}
              </div>

              <div className="tour-card__body">
                <h3 className="tour-card__title">
                  {tour.tagColor === "green" && <span>🏨 </span>}
                  {tour.title}
                </h3>

                <div className="tour-card__grid-info">
                  <div className="tour-card__info-item">
                    <BarcodeOutlined /> Mã chương trình: {tour.code}
                  </div>
                  <div className="tour-card__info-item">
                    <EnvironmentOutlined /> Điểm khởi hành: {tour.depart}
                  </div>
                  <div className="tour-card__info-item">
                    <CalendarOutlined /> Thời gian: {tour.duration}
                  </div>
                  <div className="tour-card__info-item">
                    <SendOutlined /> Phương tiện: {tour.transport}
                  </div>
                </div>

                <div className="tour-card__date-section">
                  <span className="tour-card__date-label">
                    📅 Ngày khởi hành:
                  </span>
                  <div className="tour-card__date-list">
                    {tour.dates.map((d, index) => (
                      <span key={index} className="tour-card__date-badge">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="tour-card__footer">
                  <div className="tour-card__price-section">
                    <span className="tour-card__price-label">Giá từ:</span>
                    <span className="tour-card__price-value">
                      {tour.price}đ
                    </span>
                  </div>
                  <Button type="primary" className="tour-card__submit-btn">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
