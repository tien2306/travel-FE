import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Modal,
  Button,
  Upload,
  Image,
} from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import TextArea from "antd/es/input/TextArea";
import { updateCarousel } from "../../../services/carousel";
import { patch } from "../../../utils/request";
import { IMAGE_URLS } from "../../../constants/api";

function EditCarousel(props) {
  const { record, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // State preview ảnh
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  const rule = [{ required: true, message: "Bắt buộc điền thông tin!" }];

  useEffect(() => {
    if (showModal && record) {
      form.setFieldsValue({
        title: record.title,
        subtitle: record.subtitle,
        sortOrder: record.sortOrder,
        isActive: record.isActive,
        description: record.description,
        image: [
          {
            uid: "-1",
            name: record.image,
            status: "done",
            url: `${IMAGE_URLS.HERO_CAROUSEL}${record.image?.trim()}`,
          },
        ],
      });
    }
  }, [showModal, record, form]);

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
        setShowModal(false);
        form.resetFields();
      }
    });
  };

  const getValueFromFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  // Xem trước ảnh (ảnh server dùng url, ảnh mới dùng FileReader)
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

      // Kiểm tra người dùng có chọn tệp hình ảnh MỚI từ máy tính hay không
      const hasNewImage =
        values.image && values.image[0] && values.image[0].originFileObj;

      if (hasNewImage) {
        // TRƯỜNG HỢP 1: CÓ ĐỔI ẢNH MỚI -> Dùng FormData gửi multipart/form-data
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("subtitle", values.subtitle || "");
        formData.append("sortOrder", values.sortOrder || 0);
        formData.append("isActive", values.isActive ?? true);
        formData.append("description", values.description || "");
        formData.append("image", values.image[0].originFileObj);

        // Gọi dịch vụ có sẵn sử dụng patchWithFile
        res = await updateCarousel(record.key, formData);
      } else {
        // TRƯỜNG HỢP 2: KHÔNG ĐỔI ẢNH -> Gửi Object JSON thuần (Không đính kèm field image)
        const updateData = {
          title: values.title,
          subtitle: values.subtitle || "",
          sortOrder: values.sortOrder || 0,
          isActive: values.isActive ?? true,
          description: values.description || "",
        };

        // Gọi trực tiếp utility patch
        res = await patch(updateData, `hero-carousels/${record.key}`);
      }

      if (res && res.success) {
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Cập nhật banner thành công!", timer: 1500, showConfirmButton: false });
        setShowModal(false);
        onReload();
      } else {
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Cập nhật không thành công từ máy chủ!", timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Lỗi kết nối hệ thống!", timer: 1500, showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Image ẩn để kích hoạt preview lightbox */}
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
        title="Chỉnh sửa banner"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
      >
        <Form
          name="edit-carousel"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item label="Title (Tiêu đề chính)" name="title" rules={rule}>
            <Input placeholder="Nhập tiêu đề chính" />
          </Form.Item>
          <Form.Item label="Subtitle (Tiêu đề phụ)" name="subtitle">
            <Input placeholder="Nhập tiêu đề phụ" />
          </Form.Item>
          <Form.Item label="Sort order (Thứ tự)" name="sortOrder">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Trạng thái" valuePropName="checked" name="isActive">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          <Form.Item
            label="Image (Hình ảnh)"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={getValueFromFile}
            rules={rule}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              listType="picture"
              onPreview={handlePreview}
            >
              <Button icon={<UploadOutlined />}>Thay đổi tệp</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Description (Mô tả)" name="description">
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditCarousel;
