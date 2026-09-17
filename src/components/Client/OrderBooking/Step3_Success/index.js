import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Step3Success.scss";

const Step3Success = ({ data }) => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: "success",
      title: "Đặt tour thành công!",
      text: "Hệ thống đã ghi nhận thông tin đặt tour của bạn.",
      confirmButtonText: "Đóng",
      confirmButtonColor: "var(--primary-color)",
    });
  }, []);

  return (
    <div className="step3-success-container">
      <Result
        status="success"
        title={<div className="success-title">Hoàn Tất Thanh Toán!</div>}
        subTitle={
          <div className="success-subtitle">
            Mã đơn hàng của bạn đã được ghi nhận thành công.
            <br />
            Vui lòng kiểm tra email để xem chi tiết thông tin đặt tour.
          </div>
        }
        extra={[
          <Button
            type="primary"
            key="home"
            className="btn-action btn-home"
            onClick={() => navigate("/")}
          >
            Về Trang Chủ
          </Button>,
          <Button
            key="history"
            className="btn-action btn-history"
            onClick={() => navigate("/profile")}
          >
            Xem Lịch Sử
          </Button>,
        ]}
      />
    </div>
  );
};

export default Step3Success;
