import { useState, useEffect } from "react";
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
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { updateTour } from "../../../services/tour";
import { patch } from "../../../utils/request";
import { IMAGE_URLS } from "../../../constants/api";
import dayjs from "dayjs";

function EditTour(props) {
  const { record, onReload } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const rule = [{ required: true, message: "Bắt buộc điền thông tin!" }];

  // Fill dữ liệu cũ vào form khi mở modal
  useEffect(() => {
    if (showModal && record) {
      form.setFieldsValue({
        name: record.name,
        price: record.price ? Number(record.price) : undefined,
        quantity: record.quantity,
        departurePlace: record.departurePlace,
        destination: record.destination,
        startDate: record.startDate ? dayjs(record.startDate) : undefined,
        endDate: record.endDate ? dayjs(record.endDate) : undefined,
        status: record.status,
        shortDesc: record.shortDesc,
        detailDesc: record.detailDesc,
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
      // Chuyển đổi ngày
      const formattedStartDate = values.startDate
        ? values.startDate.toISOString()
        : "";
      const formattedEndDate = values.endDate
        ? values.endDate.toISOString()
        : "";

      // Kiểm tra có đổi ảnh mới không
      const hasNewImage =
        values.thumbnail &&
        values.thumbnail[0] &&
        values.thumbnail[0].originFileObj;

      if (hasNewImage) {
        // TRƯỜNG HỢP 1: CÓ ĐỔI ẢNH MỚI -> Dùng FormData gửi multipart/form-data
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
        formData.append("image", values.thumbnail[0].originFileObj);

        res = await updateTour(record.key, formData);
      } else {
        // TRƯỜNG HỢP 2: KHÔNG ĐỔI ẢNH -> Gửi JSON thuần
        const updateData = {
          name: values.name,
          price: String(values.price),
          quantity: values.quantity,
          departurePlace: values.departurePlace || "",
          destination: values.destination || "",
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          status: values.status || "ACTIVE",
          shortDesc: values.shortDesc || "",
          detailDesc: values.detailDesc || "",
        };

        // Gọi API cập nhật thông tin bằng patch (giống EditCarousel)
        res = await patch(updateData, `tours/${record.key}`);
      }

      if (res && res.success) {
        messageApi.open({
          type: "success",
          content: "Cập nhật tour thành công!",
        });
        setShowModal(false);
        onReload();
      } else {
        messageApi.open({
          type: "error",
          content: res?.message || "Cập nhật không thành công từ máy chủ!",
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
        title="Chỉnh sửa tour"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={true}
        width={720}
      >
        <Form
          name="edit-tour"
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
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

          {/* Bổ sung Hình ảnh (Upload) để đồng bộ pattern */}
          <Form.Item
            label="Thumbnail (Hình ảnh Tour)"
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={getValueFromFile}
            rules={rule}
          >
            <Upload maxCount={1} beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Thay đổi hình ảnh</Button>
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
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditTour;
