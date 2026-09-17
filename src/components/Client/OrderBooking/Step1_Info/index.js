import React, { useState, useEffect } from "react";
import { Form, Row } from "antd";
import MainForm from "./MainForm";
import PaymentSummary from "./PaymentSummary";
import PassengerModal from "./PassengerModal";
import "./Step1Info.scss";

const Step1Info = ({ onNext, initialData, tourData }) => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm(); // bản nháp

  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [adultCount, setAdultCount] = useState(initialData?.adultCount || 1);
  const [childCount, setChildCount] = useState(initialData?.childCount || 0);
  const [toddlerCount, setToddlerCount] = useState(
    initialData?.toddlerCount || 0,
  );
  const [babyCount, setBabyCount] = useState(initialData?.babyCount || 0);

  const openPassengerModal = () => {
    // Copy dữ liệu từ form chính sang modalForm để hiển thị
    modalForm.setFieldsValue({ passengers: form.getFieldValue("passengers") });
    setIsPassengerModalOpen(true);
  };

  useEffect(() => {
    const currentPassengers =
      form.getFieldValue("passengers") || initialData?.passengers || [];
    let newPassengers = [];
    let index = 0;

    const addPassengers = (count, type) => {
      for (let i = 0; i < count; i++) {
        newPassengers.push(
          currentPassengers[index] || {
            type: type,
            fullName: "",
            dateOfBirth: null,
          },
        );
        index++;
      }
    };

    addPassengers(adultCount, "ADULT");
    addPassengers(childCount, "CHILD");
    addPassengers(toddlerCount, "TODDLER");
    addPassengers(babyCount, "BABY");

    form.setFieldsValue({ passengers: newPassengers });
  }, [
    adultCount,
    childCount,
    toddlerCount,
    babyCount,
    form,
    initialData?.passengers,
  ]);

  const onFinish = (values) => {
    const passengers = form.getFieldValue("passengers") || [];

    // Validate passengers
    const isPassengersValid = passengers.every(
      (p) => p.fullName && p.dateOfBirth,
    );
    if (!isPassengersValid) {
      import("antd").then(({ message }) => {
        message.error("Vui lòng điền đầy đủ thông tin cho tất cả hành khách!");
      });
      return;
    }

    onNext({
      ...values,
      passengers,
      adultCount,
      childCount,
      toddlerCount,
      babyCount,
    });
  };

  return (
    <div className="step1">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          contactName: initialData?.contactName || "",
          contactPhone: initialData?.contactPhone || "",
          contactEmail: initialData?.contactEmail || "",
          contactAddress: initialData?.contactAddress || "",
          passengers: initialData?.passengers || [],
        }}
      >
        <Row gutter={24}>
          <MainForm
            adultCount={adultCount}
            setAdultCount={setAdultCount}
            childCount={childCount}
            setChildCount={setChildCount}
            toddlerCount={toddlerCount}
            setToddlerCount={setToddlerCount}
            babyCount={babyCount}
            setBabyCount={setBabyCount}
            openPassengerModal={openPassengerModal}
            form={form}
          />
          <PaymentSummary
            tourData={tourData}
            adultCount={adultCount}
            childCount={childCount}
            toddlerCount={toddlerCount}
            babyCount={babyCount}
            form={form}
          />
        </Row>

        {/* khi bấm vào nhập thông tin hành khách -> hiện cái modal nhập */}
        <PassengerModal
          isOpen={isPassengerModalOpen}
          onClose={() => setIsPassengerModalOpen(false)}
          modalForm={modalForm}
          form={form}
        />
      </Form>
    </div>
  );
};

export default Step1Info;
