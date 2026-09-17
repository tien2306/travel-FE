import React from "react";
import { Typography, Image, Button, Descriptions } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { formatDate } from "../../../../helpers/format/format";
import { IMAGE_URLS } from "../../../../constants/api";
import fallbackImage from "../../../../assets/images/fallbackImage.jpg";

const { Title } = Typography;

const TourInfo = ({ tour, order, navigate }) => {
  let tourImage = fallbackImage;
  if (tour?.thumbnail || tour?.image) {
    const imageStr = String(tour.thumbnail || tour.image).trim();
    tourImage = imageStr.startsWith("http")
      ? imageStr
      : IMAGE_URLS.TOURS + imageStr;
  }

  const totalGuests =
    (order.adultCount || 0) +
    (order.childCount || 0) +
    (order.toddlerCount || 0) +
    (order.babyCount || 0);

  return (
    <>
      <Title level={4} className="section-title">
        <EnvironmentOutlined /> Thông tin chuyến đi
      </Title>
      <div className="order-detail__tour-box">
        <div className="order-detail__tour-image-wrapper">
          <Image
            src={tourImage}
            alt={tour?.name || "Tour"}
            rootClassName="order-detail__tour-image-root"
            fallback={fallbackImage}
          />
        </div>
        <div className="order-detail__tour-info">
          <Title
            level={4}
            className="tour-name"
            onClick={() => tour?.slug && navigate(`/tours/${tour.slug}`)}
          >
            {tour?.name || "Chuyến đi không còn tồn tại"}
          </Title>
          <Descriptions
            column={1}
            size="small"
            className="tour-desc"
            style={{ marginBottom: 12 }}
          >
            <Descriptions.Item label="Hành trình">
              <strong>
                {tour?.departurePlace} - {tour?.destination}
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khởi hành">
              <strong>{formatDate(tour?.startDate)}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng khách">
              <strong>{totalGuests > 0 ? totalGuests : 1} người</strong>
            </Descriptions.Item>
          </Descriptions>
          {tour?.slug && (
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => navigate(`/tours/${tour.slug}`)}
            >
              Xem lại trang giới thiệu Tour
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default TourInfo;
