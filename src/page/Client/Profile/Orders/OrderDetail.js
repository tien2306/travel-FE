import { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Tag,
  Divider,
  Row,
  Col,
  Card,
  Typography,
  Empty,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getBookingDetails, cancelBooking } from "../../../../services/booking";
import { getTourById } from "../../../../services/tour";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./OrderDetail.scss";

// Import các khối UI con
import TourInfo from "../../../../components/Client/Profile/Order/TourInfo";
import PassengerTable from "../../../../components/Client/Profile/Order/PassengerTable";
import Summary from "../../../../components/Client/Profile/Order/Summary";

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await getBookingDetails(id);
      if (res?.data) {
        const orderData = res.data;
        const tour = orderData.tour || {};
        if (!tour.thumbnail && (orderData.tourId || tour.id || tour._id)) {
          try {
            const tourRes = await getTourById(
              orderData.tourId || tour.id || tour._id,
            );
            if (tourRes?.data?.thumbnail) {
              tour.thumbnail = tourRes.data.thumbnail;
            }
            if (!tour.slug && tourRes?.data?.slug) {
              tour.slug = tourRes.data.slug;
            }
          } catch (e) {
            console.error("Lỗi khi lấy ảnh tour:", e);
          }
        }
        setOrder({ ...orderData, tour });
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      Swal.fire("Lỗi", "Không thể tải dữ liệu đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancelTour = () => {
    Swal.fire({
      title: "Xác nhận huỷ tour",
      width: 450,
      background: "var(--bg-white)",
      color: "var(--text-heading)",
      customClass: {
        popup: "swal-custom-popup",
      },
      html: `
        <div class="cancel-tour-popup">
          <p class="cancel-tour-popup__text">Bạn có chắc chắn muốn huỷ đơn đặt tour này không?</p>
          
          <div class="cancel-tour-popup__refund-box">
            <label class="cancel-tour-popup__refund-label">
              <input type="checkbox" id="swal-require-refund" class="cancel-tour-popup__checkbox" onchange="document.getElementById('swal-refund-form').style.display = this.checked ? 'block' : 'none'" />
              <span class="cancel-tour-popup__label-text">
                Tôi đã thanh toán và muốn cung cấp STK để nhận hoàn tiền.
                <span class="cancel-tour-popup__label-subtext">(Ban quản lý sẽ chủ động liên hệ nếu bạn bỏ qua bước này)</span>
              </span>
            </label>
          </div>
          
          <div id="swal-refund-form" class="cancel-tour-popup__form" style="display: none;">
            <label class="cancel-tour-popup__input-label">Ngân hàng nhận (*)</label>
            <input id="swal-bank" class="cancel-tour-popup__input" placeholder="VD: Vietcombank" />
            
            <label class="cancel-tour-popup__input-label">Số tài khoản (*)</label>
            <input id="swal-stk" class="cancel-tour-popup__input" placeholder="Nhập số tài khoản" />
            
            <label class="cancel-tour-popup__input-label">Chủ tài khoản (*)</label>
            <input id="swal-name" class="cancel-tour-popup__input cancel-tour-popup__input--uppercase" placeholder="VD: NGUYEN VAN A" />
          </div>
        </div>
      `,
      showCancelButton: true, // hiển thị nút đóng
      confirmButtonColor: "#ff4d4f",
      cancelButtonColor: "#888",
      confirmButtonText: "Đồng ý huỷ",
      cancelButtonText: "Đóng",
      preConfirm: () => {
        const requireRefund = document.getElementById(
          "swal-require-refund",
        ).checked;
        if (!requireRefund) return { requireRefund: false };
        const bank = document.getElementById("swal-bank").value.trim();
        const stk = document.getElementById("swal-stk").value.trim();
        const name = document.getElementById("swal-name").value.trim();
        if (!bank || !stk || !name) {
          Swal.showValidationMessage(
            "Vui lòng nhập đầy đủ thông tin hoàn tiền!",
          );
          return false;
        }
        return { requireRefund: true, bank, stk, name };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Đang xử lý...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          const { requireRefund, bank, stk, name } = result.value;
          let cancelReason = "Khách hàng tự huỷ trên web.";
          if (requireRefund) {
            cancelReason += ` Yêu cầu hoàn tiền: NH ${bank}, STK ${stk}, Tên ${name.toUpperCase()}`;
          }
          const res = await cancelBooking(id, {
            reason: cancelReason,
            status: "CANCELLED",
          });
          if (res && res.success === false) throw new Error(res.message);
          Swal.fire({
            title: "Thành công!",
            text: requireRefund
              ? "Đã huỷ đơn hàng. Ban quản lý sẽ xử lý hoàn tiền sớm nhất."
              : "Đã huỷ đơn hàng thành công.",
            icon: "success",
          }).then(() => fetchOrderDetail());
        } catch (error) {
          Swal.fire(
            "Lỗi!",
            error.message || "Có lỗi xảy ra khi huỷ tour.",
            "error",
          );
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="order-detail__loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <Card className="order-detail__empty">
        <Empty description="Không tìm thấy đơn hàng!" />
        <Button
          type="primary"
          onClick={() => navigate("/profile/orders")}
          style={{ marginTop: 16 }}
        >
          Quay lại danh sách
        </Button>
      </Card>
    );
  }

  const { tour, passengers } = order;
  const isCancelled = order.status === "CANCELLED";

  const renderStatus = (status) => {
    switch (status) {
      case "CANCELLED":
        return <Tag color="error">Đã huỷ</Tag>;
      case "COMPLETED":
        return <Tag color="success">Đã hoàn thành</Tag>;
      default:
        return <Tag color="processing">Đã đặt thành công</Tag>;
    }
  };

  return (
    <div className="order-detail">
      <div className="order-detail__header-bar">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="order-detail__back-btn"
        >
          Quay lại danh sách
        </Button>
      </div>

      <Card variant={false} className="order-detail__main-card">
        <div className="order-detail__title-section">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Chi tiết đơn hàng
            </Title>
            <Text type="secondary">
              Mã đơn: #
              {String(id || order._id)
                .substring(0, 8)
                .toUpperCase()}
            </Text>
          </div>
          <div>{renderStatus(order.status)}</div>
        </div>

        <Divider />

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <TourInfo tour={tour} order={order} navigate={navigate} />
            <PassengerTable passengers={passengers} />
          </Col>
          <Col xs={24} lg={8}>
            <Summary
              order={order}
              isCancelled={isCancelled}
              onCancelTour={handleCancelTour}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderDetail;
