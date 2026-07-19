import { useState, useEffect } from "react";
import { Form, Button, Modal, Image, message } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import { updateTour } from "../../../services/tour";
import { patch } from "../../../utils/request";
import { IMAGE_URLS } from "../../../constants/api";
import FormMainInputs from "../../../components/Admin/CreateTourModal/FormMainInputs";
import FormSideConfigs from "../../../components/Admin/CreateTourModal/FormSideConfigs";
import dayjs from "dayjs";

function EditTour(props) {
  const { record, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // File list cho thumbnail (single) và images (multiple)
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [imagesFileList, setImagesFileList] = useState([]);

  // State preview ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  // Fill dữ liệu cũ vào form khi mở modal
  useEffect(() => {
    if (showModal && record) {
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

        // Pre-fill thumbnail cũ
        thumbnail: record.thumbnail
          ? [
              {
                uid: "-1",
                name: record.thumbnail,
                status: "done",
                url: `${IMAGE_URLS.TOURS}${record.thumbnail?.trim()}`,
              },
            ]
          : [],

        // Pre-fill images cũ (nếu có)
        images:
          record.images && record.images.length > 0
            ? record.images.map((img, index) => ({
                uid: `-${index + 2}`,
                name: img,
                status: "done",
                url: `${IMAGE_URLS.TOURS}${img?.trim()}`,
              }))
            : [],
      });

      setThumbnailFileList(
        record.thumbnail
          ? [
              {
                uid: "-1",
                name: record.thumbnail,
                status: "done",
                url: `${IMAGE_URLS.TOURS}${record.thumbnail?.trim()}`,
              },
            ]
          : [],
      );

      setImagesFileList(
        record.images && record.images.length > 0
          ? record.images.map((img, index) => ({
              uid: `-${index + 2}`,
              name: img,
              status: "done",
              url: `${IMAGE_URLS.TOURS}${img?.trim()}`,
            }))
          : [],
      );
    }
  }, [showModal, record, form]);

  const handleShowModal = () => setShowModal(true);

  const handleCancel = () => {
    setShowModal(false);
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
    setLoading(true);
    try {
      let res;

      // Chuyển đổi ngày
      const formattedStartDate = values.startDate
        ? values.startDate.toISOString()
        : "";
      const formattedEndDate = values.endDate
        ? values.endDate.toISOString()
        : "";

      // Kiểm tra có đổi ảnh mới không (thumbnail hoặc images)
      const hasNewThumbnail =
        values.thumbnail &&
        values.thumbnail.length > 0 &&
        values.thumbnail[0]?.originFileObj;

      const hasNewImages =
        values.images &&
        values.images.length > 0 &&
        values.images.some((file) => file.originFileObj);

      if (hasNewThumbnail || hasNewImages) {
        // TRƯỜNG HỢP 1: CÓ ĐỔI ẢNH -> Dùng FormData gửi multipart/form-data
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("slug", values.slug || "");
        formData.append("price", String(values.price));
        formData.append("quantity", String(values.quantity));
        formData.append("sold", String(values.sold || 0));
        formData.append("departurePlace", values.departurePlace || "");
        formData.append("destination", values.destination || "");
        formData.append("startDate", formattedStartDate);
        formData.append("endDate", formattedEndDate);
        formData.append("status", values.status || "ACTIVE");
        formData.append("shortDesc", values.shortDesc || "");
        formData.append("detailDesc", values.detailDesc || "");

        // Thumbnail (single file)
        if (hasNewThumbnail) {
          formData.append("thumbnail", values.thumbnail[0].originFileObj);
        }

        // Images (multiple files)
        if (hasNewImages) {
          values.images.forEach((file) => {
            if (file.originFileObj) {
              formData.append("images", file.originFileObj);
            }
          });
        }

        res = await updateTour(record.key, formData);
      } else {
        // TRƯỜNG HỢP 2: KHÔNG ĐỔI ẢNH -> Gửi JSON thuần
        const updateData = {
          name: values.name,
          slug: values.slug || "",
          price: String(values.price),
          quantity: values.quantity,
          sold: values.sold || 0,
          departurePlace: values.departurePlace || "",
          destination: values.destination || "",
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          status: values.status || "ACTIVE",
          shortDesc: values.shortDesc || "",
          detailDesc: values.detailDesc || "",
        };

        res = await patch(updateData, `tours/${record.key}`);
      }

      if (res && res.success) {
        messageApi.success("Cập nhật tour thành công!");
        setShowModal(false);
        onReload();
      } else {
        messageApi.error(
          res?.message || "Cập nhật không thành công từ máy chủ!",
        );
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

      {/* Image ẩn để kích hoạt preview lightbox - Đã bọc kiểm tra rỗng và đổi phương thức */}
      {previewSrc && (
        <Image
          style={{ display: "none" }}
          src={previewSrc}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
          }}
        />
      )}

      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={handleShowModal}
      />

      <Modal
        title="Chỉnh sửa tour"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
        width={900}
      >
        <Form
          form={form}
          name="edit-tour"
          className="modern-tour-form"
          onFinish={handleSubmit}
          layout="vertical"
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

          <div
            className="form-action-footer"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button onClick={handleCancel} size="large">
              Hủy
            </Button>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              size="large"
              className="btn-submit"
            >
              Cập nhật tour
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default EditTour;
