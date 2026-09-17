import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import StepIndicator from "../../../components/Client/OrderBooking/StepIndicator";
import Step1Info from "../../../components/Client/OrderBooking/Step1_Info";
import Step2Payment from "../../../components/Client/OrderBooking/Step2_Payment";
import Step3Success from "../../../components/Client/OrderBooking/Step3_Success";
import { getTourById } from "../../../services/tour";
import { createBooking } from "../../../services/booking";
import "./OrderBooking.scss";

const OrderBooking = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0); // bước hiện tjai
  const [isTransitioning, setIsTransitioning] = useState(false); // đang xử lí
  const [tourData, setTourData] = useState(null);
  const [isLoadingTour, setIsLoadingTour] = useState(true);
  const bookingRef = React.useRef(null);

  const [bookingData, setBookingData] = useState({
    tourId: id,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
    adultCount: 1,
    childCount: 0,
    toddlerCount: 0,
    babyCount: 0,
    passengers: [],
  });

  // Fetch tour details for the summary sidebar
  useEffect(() => {
    const fetchTourInfo = async () => {
      try {
        setIsLoadingTour(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const res = await getTourById(id);
        if (res?.data) {
          setTourData(res.data);
          setBookingData((prev) => ({ ...prev, tourId: res.data.id }));
        }
      } catch (err) {
        message.error("Không thể tải thông tin Tour!");
      } finally {
        setIsLoadingTour(false);
      }
    };
    fetchTourInfo();
  }, [id]);

  const scrollToStep = () => {
    if (bookingRef.current) {
      // Offset by 80px to account for any sticky header, adjust if needed
      const offset = 80;
      const top =
        bookingRef.current.getBoundingClientRect().top +
        window.scrollY -
        offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const nextStepWithLoading = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsTransitioning(false);
      scrollToStep();
    }, 1000);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    scrollToStep();
  };

  const handleStep1Submit = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
    nextStepWithLoading();
  };

  const handleStep2Submit = async () => {
    try {
      setIsTransitioning(true);
      const res = await createBooking(bookingData);
      if (res) {
        setTimeout(() => {
          setCurrentStep(2);
          setIsTransitioning(false);
          scrollToStep();
        }, 1000);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt tour!");
      setIsTransitioning(false);
    }
  };

  const renderStepContent = () => {
    if (isLoadingTour) {
      return (
        <div className="booking-loading-full">
          <Spin size="large" description="Đang tải thông tin đơn hàng..." />
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <Step1Info
            onNext={handleStep1Submit}
            initialData={bookingData}
            tourData={tourData}
          />
        );
      case 1:
        return (
          <Step2Payment
            onNext={handleStep2Submit}
            onPrev={prevStep}
            data={bookingData}
          />
        );
      case 2:
        return <Step3Success data={bookingData} />;
      default:
        return (
          <Step1Info
            onNext={handleStep1Submit}
            initialData={bookingData}
            tourData={tourData}
          />
        );
    }
  };

  return (
    <div className="order-booking-page" ref={bookingRef}>
      <StepIndicator current={currentStep} />
      <div className="container">
        <Spin
          spinning={isTransitioning}
          description="Đang xử lý..."
          size="large"
        >
          {renderStepContent()}
        </Spin>
      </div>
    </div>
  );
};

export default OrderBooking;
