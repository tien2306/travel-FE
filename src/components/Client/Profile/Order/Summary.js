import React from "react";
import { Card, Descriptions, Typography, Divider, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { formatPrice, formatDate } from "../../../../helpers/format/format";

const { Text } = Typography;

const Summary = ({ order, isCancelled, onCancelTour }) => {
  const basePrice = Number(order?.tour?.price || 0);
  const adultPrice = basePrice;
  const childPrice = basePrice * 0.5;
  const toddlerPrice = Math.round(basePrice * 0.25);

  return (
    <>
      <Card
        className="order-detail__side-card"
        title={
          <>
            <UserOutlined /> Thông tin liên hệ
          </>
        }
      >
        <Descriptions column={1} size="small" layout="vertical">
          <Descriptions.Item label="Người đặt">
            <strong>{order.contactName}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            <strong>{order.contactPhone}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <strong>{order.contactEmail}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            <strong>{order.contactAddress || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">
            <strong>{formatDate(order.createdAt)}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        className="order-detail__side-card"
        title="Chi tiết thanh toán"
        style={{ marginTop: 24 }}
      >
        <div className="payment-summary">
          {order.adultCount > 0 && (
            <div className="payment-row">
              <Text type="secondary">
                Người lớn (100%): {order.adultCount} x {formatPrice(adultPrice)}
              </Text>
            </div>
          )}
          {order.childCount > 0 && (
            <div className="payment-row">
              <Text type="secondary">
                Trẻ em (50%): {order.childCount} x {formatPrice(childPrice)}
              </Text>
            </div>
          )}
          {order.toddlerCount > 0 && (
            <div className="payment-row">
              <Text type="secondary">
                Trẻ nhỏ (25%): {order.toddlerCount} x {formatPrice(toddlerPrice)}
              </Text>
            </div>
          )}
          {order.babyCount > 0 && (
            <div className="payment-row">
              <Text type="secondary">
                Em bé: {order.babyCount} x Miễn phí
              </Text>
            </div>
          )}

          <Divider style={{ margin: "12px 0" }} />

          <div className="payment-row total-row">
            <Text strong>Tổng thanh toán</Text>
            <Text strong className="total-price">
              {formatPrice(order.totalPrice)}
            </Text>
          </div>
        </div>

        {!isCancelled && (
          <div className="order-detail__actions">
            <Button danger block size="large" onClick={onCancelTour}>
              Huỷ đơn hàng
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};

export default Summary;
