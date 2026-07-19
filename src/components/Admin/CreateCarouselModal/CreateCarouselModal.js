import { useState } from "react";
import { Form, Button, Modal, Image, message } from "antd";
import { PlusOutlined, CheckOutlined, RedoOutlined } from "@ant-design/icons";
import { createCarousel } from "../../../services/carousel";
import FormMainInputs from "./FormMainInputs";
import FormSideConfigs from "./FormSideConfigs";
import "../../../styles/AdminModal.scss";

function CreateCarouselModal(props) {
  const { onReload } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [fileList, setFileList] = useState([]);

  // State để hiển thị preview ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  const handleShowModal = () => setShowModal(true);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setShowModal(false);
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
      messageApi.error("Vui lòng chọn một tệp hình ảnh!");
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
        messageApi.success("Tạo mới banner thành công!");
        handleResetAll();
        setShowModal(false);
        onReload();
      } else {
        messageApi.error(res?.message || "Tạo mới thất bại từ máy chủ!");
      }
    } catch (error) {
      messageApi.error("Lỗi kết nối hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
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
