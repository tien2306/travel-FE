import { useState } from "react";
import { Form, Button, Modal, Image, Steps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { createTour } from "../../../services/tour";
import { post } from "../../../utils/request";
import { ENDPOINTS } from "../../../constants/api";
import Step1Info from "./Step1Info";
import Step2Images from "./Step2Images";
import Step3Detail from "./Step3Detail";
import TourFormFooter from "./TourFormFooter";
import { handleImagePreview } from "../../../helpers/review/image";
import { buildTourPayload } from "../../../helpers/tour/tourForm";

function CreateTourModal(props) {
  const { onReload } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // Key để force remount TinyEditor khi reset form (TinyEditor dùng initialValue, không tự reset)
  const [resetKey, setResetKey] = useState(0);

  // File list cho thumbnail (single) và images (multiple)
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [imagesFileList, setImagesFileList] = useState([]);

  // State preview ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  const handleShowModal = () => setShowModal(true);

  const handleCancel = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn hủy?",
      text: "Các thông tin chưa lưu sẽ bị mất!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý thoát",
      cancelButtonText: "Tiếp tục chỉnh sửa",
    }).then((result) => {
      if (result.isConfirmed) {
        form.resetFields();
        setThumbnailFileList([]);
        setImagesFileList([]);
        setShowModal(false);
        setCurrentStep(0);
        setResetKey((k) => k + 1); // Reset TinyEditor khi đóng modal
      }
    });
  };

  const handleResetAll = () => {
    form.resetFields();
    setThumbnailFileList([]);
    setImagesFileList([]);
    setResetKey((k) => k + 1); // Force remount TinyEditor → nội dung trắng
  };

  const handleThumbnailChange = ({ fileList }) => {
    setThumbnailFileList(fileList);
  };

  const handleImagesChange = ({ fileList }) => {
    setImagesFileList(fileList);
  };

  // Xem trước ảnh (dùng chung cho thumbnail và images)
  const handlePreview = (file) =>
    handleImagePreview(file, setPreviewSrc, setPreviewOpen);

  const handleNextStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields([
          "name",
          "slug",
          "price",
          "quantity",
          "sold",
          "departurePlace",
          "destination",
          "startDate",
          "endDate",
          "status",
          "category",
          "transport",
          "shortDesc",
        ]);
      } else if (currentStep === 1) {
        // Có thể thêm logic kiểm tra ảnh ở đây nếu muốn
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Đã lưu thông tin Bước ${currentStep + 1}, mời nhập tiếp!`,
        timer: 1500,
        showConfirmButton: false,
      });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // Validate failed
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const modalFooter = (
    <TourFormFooter
      currentStep={currentStep}
      loading={loading}
      isEditMode={false} // là trạng thái tạo tour hay cập nhật tour | tạo tour thì là false
      form={form}
      onCancel={handleCancel}
      onPrevStep={handlePrevStep}
      onNextStep={handleNextStep}
      onResetAll={handleResetAll}
    />
  );

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { isFormData, payload } = buildTourPayload(values);

      let res;
      if (isFormData) {
        res = await createTour(payload);
      } else {
        res = await post(payload, ENDPOINTS.TOURS);
      }

      if (res && res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Tạo tour mới thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        handleResetAll();
        setShowModal(false);
        setCurrentStep(0);
        onReload();
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: res?.message || "Tạo tour không thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Lỗi kết nối hệ thống!",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Image ẩn để kích hoạt preview lightbox */}
      <div style={{ display: "none" }}>
        {previewSrc && (
          <Image
            src={previewSrc}
            preview={{
              open: previewOpen,
              onOpenChange: (open) => setPreviewOpen(open),
            }}
          />
        )}
      </div>

      <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
        Thêm Tour mới
      </Button>

      <Modal
        title="Thêm tour mới"
        open={showModal}
        onCancel={handleCancel}
        footer={modalFooter}
        destroyOnHidden={true} //xóa dữ liệu cũ khi mở hộp thoại
        width={900}
        wrapClassName={previewOpen ? "no-scroll-modal" : ""}
      >
        <Form
          form={form}
          name="create-tour"
          className="modern-tour-form"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ status: "ACTIVE", sold: 0 }}
        >
          <Steps
            current={currentStep}
            items={[
              { title: "Thông tin" },
              { title: "Hình ảnh" },
              { title: "Lộ trình" },
            ]}
            style={{ marginBottom: 24 }}
          />

          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            {/* key={resetKey}: force remount TinyEditor khi reset */}
            <Step1Info key={resetKey} />
          </div>

          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <Step2Images
              thumbnailFileList={thumbnailFileList}
              imagesFileList={imagesFileList}
              onThumbnailChange={handleThumbnailChange}
              onImagesChange={handleImagesChange}
              onPreview={handlePreview}
            />
          </div>

          {/* Render step 3 SAU khi user navigate tới → TinyEditor mount trong container visible */}
          {currentStep === 2 && <Step3Detail key={resetKey} />}
        </Form>
      </Modal>
    </>
  );
}

export default CreateTourModal;
