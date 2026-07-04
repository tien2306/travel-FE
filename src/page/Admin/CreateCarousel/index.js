import { useState } from "react";
import { Form, Button, message, Image } from "antd";
import { RedoOutlined, CheckOutlined } from "@ant-design/icons";
import { createCarousel } from "../../../services/carouselService";
import FormMainInputs from "../../../components/Admin/CreateCarousel/FormMainInputs";
import FormSideConfigs from "../../../components/Admin/CreateCarousel/FormSideConfigs";
import "./CreateCarousel.scss";

function CreateCarousel() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); //Lưu file list chứa ảnh

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleUploadChange = (e) => {
    const newFileList = e.fileList;
    setFileList(newFileList);
  };

  const handleResetAll = () => {
    form.resetFields();
    setFileList([]);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(file.url || file.preview);
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
      if (res?.success) {
        handleResetAll();
        messageApi.success("Tạo mới banner thành công!");
      } else {
        messageApi.error("Tạo mới thất bại từ máy chủ!");
      }
    } catch (error) {
      messageApi.error("Lỗi kết nối hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-banner-container">
      {contextHolder}
      <div className="page-header">
        <h2 className="header-title">Tạo banner mới</h2>
        <p className="header-sub">
          Banner ở trạng thái kích hoạt sẽ hiển thị trực tiếp ngoài giao diện
          public.
        </p>
      </div>

      <Form
        form={form}
        name="create-carousel"
        className="modern-banner-form"
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ sortOrder: 0, isActive: true }}
      >
        <div className="form-grid-layout">
          {/* Phần tiêu đề */}
          <FormMainInputs />

          {/* Phần upload, trạng thái */}
          <FormSideConfigs
            fileList={fileList}
            onPreview={handlePreview}
            onUploadChange={handleUploadChange}
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

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default CreateCarousel;
