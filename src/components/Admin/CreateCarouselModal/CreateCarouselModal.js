import { useState } from "react";
import { Form, Button, Modal, Image } from "antd";
import { PlusOutlined, CheckOutlined, RedoOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { createCarousel } from "../../../services/carousel";
import FormMainInputs from "./FormMainInputs";
import FormSideConfigs from "./FormSideConfigs";


function CreateCarouselModal(props) {
  const { onReload } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [fileList, setFileList] = useState([]);

  // State để hiển thị preview ảnh
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
        setFileList([]);
        setShowModal(false);
      }
    });
  };

  const handleResetAll = () => {
    form.resetFields();
    setFileList([]);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Xem trước ảnh đã chọn (local file hoặc url)
  const handlePreview = async (file) => {
    // Nếu đã có url (ảnh từ server) thì dùng luôn
    if (file.url) {
      setPreviewSrc(file.url);
      setPreviewOpen(true);
      return;
    }

    // Nếu là ảnh local mới chọn, tạo preview bằng FileReader
    if (!file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewSrc(file.preview);
    setPreviewOpen(true);
  };

  const handleSubmit = async (values) => {
    if (!values.image || values.image.length === 0) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Vui lòng chọn một tệp hình ảnh!", timer: 1500, showConfirmButton: false });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("subtitle", values.subtitle || "");
      formData.append("sortOrder", values.sortOrder || 0);
      formData.append("isActive", values.isActive ?? true);
      formData.append("description", values.description || "");
      formData.append("image", values.image[0].originFileObj);

      const res = await createCarousel(formData);

      if (res && res.success) {
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Tạo mới banner thành công!", timer: 1500, showConfirmButton: false });
        handleResetAll();
        setShowModal(false);
        onReload();
      } else {
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: res?.message || "Tạo mới thất bại từ máy chủ!", timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Lỗi kết nối hệ thống!", timer: 1500, showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
        Thêm Banner mới
      </Button>

      {/* Preview ảnh ẩn — được kích hoạt khi handlePreview gọi */}
      {previewSrc && (
        <Image
          style={{ display: "none" }}
          src={previewSrc}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open), // Đổi thành onOpenChange
          }}
        />
      )}

      <Modal
        title="Thêm banner mới"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
        width={900}
      >
        <Form
          form={form}
          name="create-carousel"
          className="modern-banner-form"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ sortOrder: 0, isActive: true }}
        >
          <div className="form-grid-layout">
            <FormMainInputs />

            <FormSideConfigs
              fileList={fileList}
              onUploadChange={handleUploadChange}
              onPreview={handlePreview}
            />
          </div>

          <div className="form-action-footer">
            <Button
              className="btn-reset"
              icon={<RedoOutlined />}
              onClick={handleResetAll}
              size="large"
            >
              Làm mới form
            </Button>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              size="large"
              className="btn-submit"
            >
              Lưu banner
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default CreateCarouselModal;
