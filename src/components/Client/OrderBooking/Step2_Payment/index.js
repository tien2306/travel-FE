import React from "react";
import { Button, Result } from "antd";

const Step2Payment = ({ onNext, onPrev, data }) => {
  return (
    <div
      style={{ padding: "40px", backgroundColor: "var(--bg-white)", borderRadius: "8px" }}
    >
      <Result
        status="info"
        title="Trang Thanh toán"
        subTitle="Màn hình này sẽ hiển thị thông tin để thanh toán (Đang xây dựng)"
        extra={[
          <Button key="back" onClick={onPrev}>
            Quay lại
          </Button>,
          <Button type="primary" key="next" onClick={onNext}>
            Xác nhận thanh toán
          </Button>,
        ]}
      />
    </div>
  );
};

export default Step2Payment;
