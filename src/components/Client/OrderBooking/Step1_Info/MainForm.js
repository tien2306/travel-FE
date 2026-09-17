import React from "react";
import { Form, Input, Row, Col, Card } from "antd";

// NÚT TĂNG GIẢM SỐ LƯỢNG
const PassengerControl = ({ label, subLabel, value, onChange, min = 0 }) => (
  <div className="qty-ctrl">
    <div className="qty-ctrl__info">
      <strong>{label}</strong>
      <span>{subLabel}</span>
    </div>
    <div className="qty-ctrl__actions">
      <button
        type="button"
        className="qty-ctrl__btn"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        -
      </button>
      <span className="qty-ctrl__val">{value}</span>
      <button
        type="button"
        className="qty-ctrl__btn"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  </div>
);

// FORM LIÊN HỆ & TÓM TẮT
const MainForm = ({
  adultCount,
  setAdultCount,
  childCount,
  setChildCount,
  toddlerCount,
  setToddlerCount,
  babyCount,
  setBabyCount,
  openPassengerModal,
  form,
}) => {
  return (
    <Col xs={24} lg={16}>
      {/* 1. THÔNG TIN LIÊN LẠC */}
      <Card title="Thông tin liên lạc" className="card" variant={false}>
        <Row gutter={16}>
          {/* Họ tên */}
          <Col xs={24} md={12}>
            <Form.Item
              name="contactName"
              label="Họ tên (*)"
              validateTrigger="onSubmit"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>

          {/* Số điện thoại */}
          <Col xs={24} md={12}>
            <Form.Item
              name="contactPhone"
              label="Số điện thoại (*)"
              validateTrigger="onSubmit"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
                {
                  pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col xs={24} md={12}>
            <Form.Item
              name="contactEmail"
              label="Email (*)"
              validateTrigger="onSubmit"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>

          {/* Địa chỉ */}
          <Col xs={24} md={12}>
            <Form.Item name="contactAddress" label="Địa chỉ">
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 2. HÀNH KHÁCH */}
      <Card title="Hành khách" className="card" variant={false}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <PassengerControl
              label="Người lớn"
              subLabel="Từ 12 tuổi trở lên"
              value={adultCount}
              onChange={setAdultCount}
              min={1}
            />
          </Col>
          <Col xs={24} md={12}>
            <PassengerControl
              label="Trẻ em"
              subLabel="Từ 5 - 11 tuổi"
              value={childCount}
              onChange={setChildCount}
            />
          </Col>
          <Col xs={24} md={12}>
            <PassengerControl
              label="Trẻ nhỏ"
              subLabel="Từ 2 - 4 tuổi"
              value={toddlerCount}
              onChange={setToddlerCount}
            />
          </Col>
          <Col xs={24} md={12}>
            <PassengerControl
              label="Em bé"
              subLabel="Dưới 2 tuổi"
              value={babyCount}
              onChange={setBabyCount}
            />
          </Col>
        </Row>
      </Card>

      {/* 3. THÔNG TIN HÀNH KHÁCH */}
      <h3 className="step1__title">Thông tin hành khách</h3>
      <Form.Item
        // cái shouldUpdate này chỉ đề theo dỏi có sự thay đổi render lại thôi
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.passengers !== currentValues.passengers
        }
      >
        {() => {
          const currentPassengers = form.getFieldValue("passengers") || [];
          return (
            <div className="passenger-summary-list">
              {currentPassengers.map((p, index) => {
                const isFilled = p.fullName && p.dateOfBirth; // trả về true/ false
                const typeLabels = {
                  ADULT: "Người lớn",
                  CHILD: "Trẻ em",
                  TODDLER: "Trẻ nhỏ",
                  BABY: "Em bé",
                };

                return (
                  <div
                    key={index}
                    className="p-summary"
                    onClick={openPassengerModal}
                  >
                    <div className="p-summary__index">#{index + 1}</div>
                    <div
                      className={`p-summary__box ${isFilled ? "p-summary__box--filled" : ""}`}
                    >
                      {isFilled ? (
                        <>
                          <span className="name">{p.fullName}</span>
                          <span className="dob">
                            {p.dateOfBirth.format("DD/MM/YYYY")}
                          </span>
                          {p.phone && <span className="phone">{p.phone}</span>}
                          <span className="edit">Chỉnh sửa &rarr;</span>
                        </>
                      ) : (
                        <>
                          <span className="empty">
                            {typeLabels[p.type]} (*)
                          </span>
                          <span className="edit">Nhập thông tin &rarr;</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      </Form.Item>
    </Col>
  );
};

export default MainForm;
