import { useState } from "react";
import {
  message,
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
  Button,
  DatePicker,
  Row,
  Col,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { createTour } from "../../../services/tour";

function CreateTourModal(props) {
  const { onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const rule = [{ required: true, message: "Bắt buộc điền thông tin!" }];

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
    if (!values.thumbnail || values.thumbnail.length === 0) {
      messageApi.error("Vui lòng chọn một hình ảnh (Thumbnail) cho tour!");
      return;
    }
    setLoading(true);
    try {
      // Chuyển đổi ngày
      const formattedStartDate = values.startDate
        ? values.startDate.toISOString()
        : "";
      const formattedEndDate = values.endDate
        ? values.endDate.toISOString()
        : "";

      // Khởi tạo FormData
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", String(values.price));
      formData.append("quantity", values.quantity);
      formData.append("departurePlace", values.departurePlace || "");
      formData.append("destination", values.destination || "");
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("status", values.status || "ACTIVE");
      formData.append("shortDesc", values.shortDesc || "");
      formData.append("detailDesc", values.detailDesc || "");

      // File ảnh được lưu trữ trong originFileObj
      formData.append("image", values.thumbnail[0].originFileObj);

      const res = await createTour(formData);

      if (res && res.success) {
        messageApi.open({
          type: "success",
          content: "Tạo tour mới thành công!",
        });
        form.resetFields();
        setShowModal(false);
        onReload();
      } else {
        messageApi.open({
          type: "error",
          content: res?.message || "Tạo tour không thành công!",
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
      <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
        Thêm Tour mới
      </Button>
      <Modal
        title="Thêm tour mới"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
        width={720}
      >
        <Form
          name="create-tour"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ status: "ACTIVE" }}
        >
          <Form.Item label="Tên tour" name="name" rules={rule}>
            <Input placeholder="Nhập tên tour" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Giá (VNĐ)" name="price" rules={rule}>
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/,/g, "")}
                  placeholder="Nhập giá tour"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Số lượng" name="quantity" rules={rule}>
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Số lượng chỗ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Nơi khởi hành" name="departurePlace">
                <Input placeholder="Ví dụ: TP. Hồ Chí Minh" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Điểm đến" name="destination">
                <Input placeholder="Ví dụ: Đà Lạt" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Ngày bắt đầu" name="startDate">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Ngày kết thúc" name="endDate">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Trạng thái" name="status">
            <Select
              options={[
                { value: "ACTIVE", label: "Đang hoạt động" },
                { value: "INACTIVE", label: "Ngừng hoạt động" },
              ]}
            />
          </Form.Item>

          {/* Bổ sung field Hình ảnh (Upload) để truyền FormData */}
          <Form.Item
            label="Thumbnail (Hình ảnh Tour)"
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={getValueFromFile}
            rules={rule}
          >
            <Upload maxCount={1} beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Mô tả ngắn" name="shortDesc">
            <TextArea rows={2} placeholder="Nhập mô tả ngắn gọn" />
          </Form.Item>

          <Form.Item label="Mô tả chi tiết" name="detailDesc">
            <TextArea rows={4} placeholder="Nhập lịch trình chi tiết" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button style={{ marginRight: 8 }} onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreateTourModal;
