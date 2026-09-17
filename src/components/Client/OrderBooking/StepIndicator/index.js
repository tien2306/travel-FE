import React from "react";
import { Steps } from "antd";
// import { useTranslation } from "react-i18next";
import "./StepIndicator.scss";

const StepIndicator = ({ current }) => {
  // const { t } = useTranslation("booking");

  const items = [
    {
      title: "Nhập thông tin", // Có thể dùng t("step1") sau này
    },
    {
      title: "Thanh toán",
    },
    {
      title: "Hoàn tất",
    },
  ];

  return (
    <div className="step-indicator-wrapper">
      <Steps current={current} items={items} className="custom-steps" />
    </div>
  );
};

export default StepIndicator;
