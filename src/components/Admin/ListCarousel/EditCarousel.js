import { useState, useEffect } from "react";
import {
  message,
  Form,
  Input,
  InputNumber,
  Switch,
  Modal,
  Button,
  Upload,
} from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { updateCarousel } from "../../../services/carouselService";
import { patch } from "../../../utils/request";
import { IMAGE_URLS } from "../../../constants/api";

function EditCarousel(props) {
  const { record, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

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
    setShowModal(false);
    form.resetFields();
  };

  const getValueFromFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
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
        messageApi.open({
          type: "success",
          content: "Cập nhật banner thành công!",
        });
        setShowModal(false);
        onReload();
      } else {
        messageApi.open({
          type: "error",
          content: "Cập nhật không thành công từ máy chủ!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Lỗi kết nối hệ thống!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
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
            <Upload maxCount={1} beforeUpload={() => false} listType="picture">
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
