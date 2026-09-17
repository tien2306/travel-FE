import React, { useState, useEffect, useRef } from "react";
import { Spin, Tag, Empty, Card, Typography, Space, Pagination } from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMyBookings } from "../../../../services/booking";
import { getTourById } from "../../../../services/tour";
import { formatPrice, formatDate } from "../../../../helpers/format/format";
import { IMAGE_URLS } from "../../../../constants/api";
import fallbackImage from "../../../../assets/images/fallbackImage.jpg";
import "./Orders.scss";

const { Title, Text } = Typography;

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = parseInt(searchParams.get("limit")) || 5;

  const [bookings, setBookings] = useState([]); // lưu danh sách đặt
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const ordersRef = useRef(null);
  const urlImage = IMAGE_URLS.TOURS;

  const fetchBookings = async (page, limit) => {
    try {
      setLoading(true);
      const res = await getMyBookings({ page, limit });

      let data = [];
      let totalItems = 0;
      let rawData = [];

      if (res?.data?.items) {
        rawData = res.data.items;
        totalItems =
          res.data.pagination?.total || res.data.total || res.data.items.length;
      } else if (res?.data) {
        rawData = Array.isArray(res.data) ? res.data : [res.data];
        totalItems = rawData.length;
      }

      // FALLBACK FRONTEND PAGINATION
      if (rawData.length > limit) {
        rawData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const startIndex = (page - 1) * limit;
        data = rawData.slice(startIndex, startIndex + limit);
      } else {
        data = rawData;
      }

      // Xử lí dử liệu trả về mảng có ảnh
      const enrichedData = await Promise.all(
        data.map(async (booking) => {
          const tour = booking.tour || {};
          if (!tour.thumbnail && (booking.tourId || tour.id || tour._id)) {
            try {
              const tourRes = await getTourById(
                booking.tourId || tour.id || tour._id,
              );
              if (tourRes?.data?.thumbnail) {
                tour.thumbnail = tourRes.data.thumbnail;
              }
              if (!tour.slug && tourRes?.data?.slug) {
                tour.slug = tourRes.data.slug;
              }
            } catch (err) {
              console.error("Lỗi khi lấy thông tin tour bổ sung:", err);
            }
          }
          // cập nhật lại ds booking có image và slug
          return { ...booking, tour };
        }),
      );

      setBookings(enrichedData);
      setTotal(totalItems || enrichedData.length);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const renderStatus = (status) => {
    switch (status) {
      case "CANCELLED":
        return (
          <Tag color="error" className="status-tag">
            Đã huỷ
          </Tag>
        );
      case "COMPLETED":
        return (
          <Tag color="success" className="status-tag">
            Đã hoàn thành
          </Tag>
        );
      default:
        return (
          <Tag color="processing" className="status-tag">
            Đã đặt thành công
          </Tag>
        );
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="orders__loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="orders" ref={ordersRef}>
      <Title level={3} className="orders__title">
        Lịch sử đặt tour
      </Title>

      {bookings.length === 0 ? (
        <Card className="orders__empty-card">
          <Empty description="Bạn chưa có đơn đặt tour nào" />
        </Card>
      ) : (
        <>
          <div className="orders__list">
            {bookings.map((booking) => (
              <OrderCard
                key={booking.id || booking._id}
                booking={booking} // từng p/tử(item) của bookings
                navigate={navigate}
                urlImage={urlImage}
                renderStatus={renderStatus}
              />
            ))}
          </div>

          <div
            className="orders__pagination"
            style={{ marginTop: 32, textAlign: "center" }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={(page, size) => {
                setSearchParams({ page, limit: size });
                setCurrentPage(page);
                setPageSize(size);
                if (ordersRef.current) {
                  const offset = 80;
                  const top =
                    ordersRef.current.getBoundingClientRect().top +
                    window.scrollY -
                    offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
            />
          </div>
        </>
      )}
    </div>
  );
};

// COMPONENT CON: THẺ TỪNG ĐƠN HÀNG
const OrderCard = ({ booking, navigate, urlImage, renderStatus }) => {
  const tour = booking.tour || {};
  const tourName = tour?.name || "Chuyến đi không còn tồn tại";

  let tourImage = fallbackImage;
  if (tour?.thumbnail || tour?.image) {
    const imageStr = String(tour.thumbnail || tour.image).trim();
    tourImage = imageStr.startsWith("http") ? imageStr : urlImage + imageStr;
  }

  const totalGuests =
    (booking.adultCount || 0) +
    (booking.childCount || 0) +
    (booking.toddlerCount || 0) +
    (booking.babyCount || 0);

  return (
    <Card
      className="order-card"
      hoverable
      bodyStyle={{ padding: 0 }}
      onClick={() => navigate(`/profile/orders/${booking.id || booking._id}`)}
    >
      <div className="order-card__header">
        <Text type="secondary" className="order-card__date">
          Đặt ngày: {formatDate(booking.createdAt)}
        </Text>
        <Space>
          <Text strong className="order-card__id">
            #
            {String(booking.id || booking._id)
              .substring(0, 8)
              .toUpperCase()}
          </Text>
          {renderStatus(booking.status)}
        </Space>
      </div>

      <div className="order-card__body">
        <div className="order-card__image-container">
          <img
            className="order-card__image"
            src={tourImage}
            alt={tourName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        </div>

        <div className="order-card__content">
          <Title
            level={4}
            className="order-card__tour-name"
            style={{ margin: 0, marginBottom: "12px" }}
          >
            <span className="tour-name-text">{tourName}</span>
          </Title>

          <div className="order-card__meta">
            {tour?.departurePlace && (
              <Text type="secondary">
                <EnvironmentOutlined /> {tour.departurePlace} -{" "}
                {tour.destination}
              </Text>
            )}
            {tour?.startDate && (
              <Text type="secondary">
                <CalendarOutlined /> Khởi hành: {formatDate(tour.startDate)}
              </Text>
            )}
          </div>
        </div>

        <div className="order-card__summary">
          <div className="summary-item">
            <Text type="secondary">Số lượng khách</Text>
            <Text strong>{totalGuests > 0 ? totalGuests : 1} khách</Text>
          </div>
          <div className="summary-item">
            <Text type="secondary">Tổng thanh toán</Text>
            <Text strong className="price-text">
              {formatPrice(booking.totalPrice || tour?.price || 0)}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Orders;
