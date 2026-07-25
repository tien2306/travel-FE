import { useState } from "react";
import { Form, Button, Modal, Image, message } from "antd";
import { PlusOutlined, CheckOutlined, RedoOutlined } from "@ant-design/icons";
import { createTour } from "../../../services/tour";
import FormMainInputs from "./FormMainInputs";
import FormSideConfigs from "./FormSideConfigs";
import "../../../styles/AdminModal.scss";

function CreateTourModal(props) {
  const { onReload } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // File list cho thumbnail (single) và images (multiple)
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [imagesFileList, setImagesFileList] = useState([]);

  // State preview ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  const handleShowModal = () => setShowModal(true);

  const handleCancel = () => {
    form.resetFields();
    setThumbnailFileList([]);
    setImagesFileList([]);
    setShowModal(false);
  };

  const handleResetAll = () => {
    form.resetFields();
    setThumbnailFileList([]);
    setImagesFileList([]);
  };

  const handleThumbnailChange = ({ fileList }) => {
    setThumbnailFileList(fileList);
  };

  const handleImagesChange = ({ fileList }) => {
    setImagesFileList(fileList);
  };

  // Xem trước ảnh (dùng chung cho thumbnail và images)
  const handlePreview = async (file) => {
    if (file.url) {
      setPreviewSrc(file.url);
      setPreviewOpen(true);
      return;
    }
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
    // Validate thumbnail
    // if (!values.thumbnail || values.thumbnail.length === 0) {
    //   messageApi.error("Vui lòng chọn một ảnh thumbnail cho tour!");
    //   return;
    // }

    setLoading(true);
    try {
      const formData = new FormData();

      // Text fields
      formData.append("name", values.name);
      // formData.append("slug", values.slug || "");
      formData.append("price", String(values.price));
      formData.append("quantity", String(values.quantity));
      formData.append("sold", String(values.sold || 0));
      formData.append("departurePlace", values.departurePlace || "");
      formData.append("destination", values.destination || "");
      formData.append("shortDesc", values.shortDesc || "");
      formData.append("detailDesc", values.detailDesc || "");
      formData.append("status", values.status || "ACTIVE");
      formData.append("category", values.category || "");
      formData.append("transport", values.transport || "");

      // Date fields
      if (values.startDate) {
        formData.append("startDate", values.startDate.toISOString());
      }
      if (values.endDate) {
        formData.append("endDate", values.endDate.toISOString());
      }

      // Thumbnail (single file)
      if (
        values.thumbnail &&
        values.thumbnail.length > 0 &&
        values.thumbnail[0]?.originFileObj
      ) {
        formData.append("thumbnail", values.thumbnail[0].originFileObj);
      }

      // Images (multiple files array)
      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          if (file.originFileObj) {
            formData.append("images", file.originFileObj);
          }
        });
      }
      const res = await createTour(formData);

      if (res && res.success) {
        messageApi.success("Tạo tour mới thành công!");
        handleResetAll();
        setShowModal(false);
        onReload();
      } else {
        messageApi.error(res?.message || "Tạo tour không thành công!");
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
        footer={null}
        destroyOnHidden={true}
        width={900}
      >
        <Form
          form={form}
          name="create-tour"
          className="modern-tour-form"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ status: "ACTIVE", sold: 0 }}
        >
          <div className="form-grid-layout">
            {/* Cột trái: các trường chính */}
            <FormMainInputs />

            {/* Cột phải: cấu hình + upload */}
            <FormSideConfigs
              thumbnailFileList={thumbnailFileList}
              imagesFileList={imagesFileList}
              onThumbnailChange={handleThumbnailChange}
              onImagesChange={handleImagesChange}
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
              Tạo tour
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default CreateTourModal;
