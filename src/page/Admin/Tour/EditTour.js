import { useState } from "react";
import { Form, Button, Modal, Image, Steps } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { updateTour } from "../../../services/tour";
import { patch } from "../../../utils/request";
import { IMAGE_URLS } from "../../../constants/api";
import Step1Info from "../../../components/Admin/Tour/Step1Info";
import Step2Images from "../../../components/Admin/Tour/Step2Images";
import Step3Detail from "../../../components/Admin/Tour/Step3Detail";
import TourFormFooter from "../../../components/Admin/Tour/TourFormFooter";
import dayjs from "dayjs";
import { handleImagePreview } from "../../../helpers/review/image";
import { buildTourPayload } from "../../../helpers/tour/tourForm";

function EditTour(props) {
  const { record, onReload } = props;
  // console.log(record);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // File list cho thumbnail (single) và images (multiple)
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [imagesFileList, setImagesFileList] = useState([]);

  // State preview ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  // setFieldsValue cho form
  const buildThumbnailList = () =>
    record.thumbnail
      ? [
          {
            uid: "-1", // id do antd tự sinh
            name: record.thumbnail, // tên file ảnh
            status: "done",
            url: `${IMAGE_URLS.TOURS}${record.thumbnail?.trim()}`,
          },
        ]
      : [];

  // setFieldsValue cho form
  const buildImagesList = () =>
    record.images && record.images.length > 0
      ? record.images.map((img, index) => ({
          uid: `-${index + 2}`, // id do antd tự sinh
          name: img, // tên file ảnh
          status: "done",
          url: `${IMAGE_URLS.TOURS}${img?.trim()}`,
        }))
      : [];

  //Xử lí hiện modal
  const handleShowModal = () => {
    const thumbnailItems = buildThumbnailList();
    const imagesItems = buildImagesList();

    form.setFieldsValue({
      name: record.name,
      slug: record.slug || "",
      price: record.price ? Number(record.price) : undefined,
      quantity: record.quantity,
      sold: record.sold || 0,
      departurePlace: record.departurePlace,
      destination: record.destination,
      startDate: record.startDate ? dayjs(record.startDate) : undefined,
      endDate: record.endDate ? dayjs(record.endDate) : undefined,
      status: record.status,
      shortDesc: record.shortDesc,
      detailDesc: record.detailDesc,
      category: record.category,
      transport: record.transport,
      thumbnail: thumbnailItems,
      images: imagesItems,
    });

    setThumbnailFileList(thumbnailItems);
    setImagesFileList(imagesItems);
    setShowModal(true);
  };

  //Xử lí hủy modal
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
        setShowModal(false);
        form.resetFields();
        setThumbnailFileList([]);
        setImagesFileList([]);
        setCurrentStep(0);
      }
    });
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

  // Xử lí trang tiếp theo
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
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Đã lưu tạm thông tin Bước ${currentStep + 1}, mời nhập tiếp!`,
        timer: 1500,
        showConfirmButton: false,
      });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // Validate failed
    }
  };

  // Xử lí trang trước đó
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  //Xử lí footer Modal
  const modalFooter = (
    <TourFormFooter
      currentStep={currentStep}
      loading={loading}
      isEditMode={true}
      form={form}
      onCancel={handleCancel}
      onPrevStep={handlePrevStep}
      onNextStep={handleNextStep}
    />
  );

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { isFormData, payload } = buildTourPayload(values);

      let res;
      if (isFormData) {
        res = await updateTour(record.key, payload);
      } else {
        res = await patch(payload, `tours/${record.key}`);
      }

      if (res && res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Cập nhật tour thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        setShowModal(false);
        setCurrentStep(0);
        onReload();
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: res?.message || "Cập nhật không thành công từ máy chủ!",
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
              onOpenChange: (open) => setPreviewOpen(open), //truyền true, false
            }}
          />
        )}
      </div>

      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={handleShowModal}
      />

      <Modal
        title="Chỉnh sửa tour"
        open={showModal}
        onCancel={handleCancel}
        footer={modalFooter}
        destroyOnHidden={true} //xóa dữ liệu cũ khi mở hộp thoại
        width={900}
        wrapClassName={previewOpen ? "no-scroll-modal" : ""}
      >
        <Form
          form={form}
          name="edit-tour"
          className="modern-tour-form"
          onFinish={handleSubmit}
          layout="vertical"
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
            <Step1Info />
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
          {currentStep === 2 && <Step3Detail />}
        </Form>
      </Modal>
    </>
  );
}

export default EditTour;
