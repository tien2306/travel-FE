import React from "react";
import { Col, Card, Divider, Form, Input, Button, Collapse } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { IMAGE_URLS } from "../../../../constants/api";
import fallbackImage from "../../../../assets/images/fallbackImage.jpg";

const RightColumn = ({
  tourData,
  adultCount,
  childCount,
  toddlerCount,
  babyCount,
  form,
}) => {
  // Hàm format tiền tệ
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Tính toán giá tiền
  const basePrice = tourData?.price || 0;
  const adultPriceTotal = basePrice * adultCount;
  const childPriceTotal = basePrice * 0.5 * childCount;
  const toddlerPriceTotal = basePrice * 0.25 * toddlerCount;
  const babyPriceTotal = 0; // Miễn phí

  const totalPrice =
    adultPriceTotal + childPriceTotal + toddlerPriceTotal + babyPriceTotal;

  // Dữ liệu cho dropdown chi phí
  const costDetails = [
    {
      key: "1",
      label: (
        <span style={{ fontWeight: 500, color: "var(--primary-color)" }}>
          Chi tiết chi phí
        </span>
      ),
      children: (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {adultCount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                Người lớn (100%): {adultCount} x {formatPrice(basePrice)}
              </span>
              <strong>{formatPrice(adultPriceTotal)}</strong>
            </div>
          )}
          {childCount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                Trẻ em (50%): {childCount} x {formatPrice(basePrice * 0.5)}
              </span>
              <strong>{formatPrice(childPriceTotal)}</strong>
            </div>
          )}
          {toddlerCount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                Trẻ nhỏ (25%): {toddlerCount} x {formatPrice(basePrice * 0.25)}
              </span>
              <strong>{formatPrice(toddlerPriceTotal)}</strong>
            </div>
          )}
          {babyCount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Em bé: {babyCount} x Miễn phí</span>
              <strong>0 ₫</strong>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Col xs={24} lg={8}>
      <Card className="card summary" variant={false}>
        <h3 className="summary__title">Tóm tắt đơn hàng</h3>
        {tourData ? (
          <div>
            <div className="summary__tour">
              <div className="summary__img">
                <img
                  src={
                    tourData.thumbnail
                      ? `${IMAGE_URLS.TOURS}${tourData.thumbnail}`
                      : fallbackImage
                  }
                  alt={tourData.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
              </div>
              <div>
                <div style={{ marginBottom: "8px", marginTop: "12px" }}>
                  <span className="summary__tour-id">
                    #{tourData.id?.substring(0, 8).toUpperCase()}
                  </span>
                </div>
                <h4 className="summary__name">{tourData.name}</h4>
              </div>
            </div>

            <div style={{ marginTop: "16px", marginBottom: "8px" }}>
              <Collapse ghost expandIconPlacement="end" items={costDetails} />
            </div>

            <Divider />
            <div className="summary__total">
              <span className="label">Tổng tiền</span>
              <span className="value">
                {tourData.price ? formatPrice(totalPrice) : "Đang cập nhật"}
              </span>
            </div>
          </div>
        ) : (
          <div>Đang tải thông tin...</div>
        )}

        <Divider />

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Vui lòng đồng ý với điều khoản")),
            },
          ]}
          className="summary__terms"
        >
          <label className="terms-checkbox" style={{ cursor: "pointer" }}>
            <Input
              type="checkbox"
              className="custom-checkbox"
              style={{ pointerEvents: "none" }}
            />
            <span>
              Tôi đồng ý với{" "}
              <a href="#!" onClick={(e) => e.stopPropagation()}>
                Chính sách bảo vệ dữ liệu cá nhân
              </a>{" "}
              và{" "}
              <a href="#!" onClick={(e) => e.stopPropagation()}>
                Các điều khoản
              </a>
            </span>
          </label>
        </Form.Item>

        <Form.Item shouldUpdate className="submit-form-item">
          {() => {
            // const errors = form
            //   .getFieldsError()
            //   .filter(({ errors }) => errors.length).length;
            const terms = form.getFieldValue("terms");
            const contactName = form.getFieldValue("contactName");
            const contactPhone = form.getFieldValue("contactPhone");
            const contactEmail = form.getFieldValue("contactEmail");
            const passengers = form.getFieldValue("passengers") || [];
            const isPassengersFilled = passengers.every(
              (p) => p.fullName && p.dateOfBirth,
            );

            const isFormValid =
              terms &&
              contactName &&
              contactPhone &&
              contactEmail &&
              isPassengersFilled;

            return (
              <div className="submit">
                <div className="submit__phone">
                  <PhoneOutlined />
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`submit__btn ${!isFormValid ? "submit__btn--disabled" : ""}`}
                  disabled={!isFormValid}
                  block
                >
                  {isFormValid ? "Tiếp tục" : "Chưa nhập đủ thông tin"}
                </Button>
              </div>
            );
          }}
        </Form.Item>
      </Card>
    </Col>
  );
};

export default RightColumn;
