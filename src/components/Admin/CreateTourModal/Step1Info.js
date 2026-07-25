import { Form, Input, InputNumber, Row, Col, DatePicker, Select } from "antd";
import QuillEditor from "../../Common/QuillEditor";

function Step1Info() {
  const rule = [{ required: true, message: "Bắt buộc điền thông tin này!" }];

  return (
    <div className="step-content-container">
      <Form.Item label="Tên tour" name="name" rules={rule}>
        <Input size="large" placeholder="Nhập tên tour" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Slug"
            name="slug"
            tooltip="Đường dẫn thân thiện cho SEO (vd: tour-da-lat-3-ngay)"
          >
            <Input
              size="large"
              placeholder="Nhập slug (tự sinh nếu bỏ trống)"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Trạng thái" name="status">
            <Select
              size="large"
              options={[
                { value: "ACTIVE", label: "Đang hoạt động" },
                { value: "INACTIVE", label: "Ngừng hoạt động" },
                { value: "CLOSED", label: "Đã đóng" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Giá (VNĐ)" name="price" rules={rule}>
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              size="large"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/,/g, "")}
              placeholder="Nhập giá tour"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Số lượng chỗ" name="quantity" rules={rule}>
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              size="large"
              placeholder="Tổng số chỗ"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Ngày khởi hành" name="startDate">
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày đi"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Ngày kết thúc" name="endDate">
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày về"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Nơi khởi hành" name="departurePlace">
            <Input size="large" placeholder="Ví dụ: TP. Hồ Chí Minh" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="Điểm đến" name="destination">
            <Input size="large" placeholder="Ví dụ: Đà Lạt, Nha Trang..." />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Dòng tour" name="category">
            <Select
              size="large"
              placeholder="Chọn dòng tour"
              options={[
                { value: "STANDARD", label: "Tiêu chuẩn" },
                { value: "PREMIUM", label: "Cao cấp" },
                { value: "SAVING", label: "Tiết kiệm" },
                { value: "ECONOMY", label: "Giá rẻ" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Phương tiện" name="transport">
            <Select
              size="large"
              placeholder="Chọn phương tiện"
              options={[
                { value: "PLANE", label: "Máy bay" },
                { value: "BUS", label: "Xe khách" },
                { value: "MOTORBIKE", label: "Xe máy" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Đã bán" name="sold">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              size="large"
              placeholder="Số lượng đã bán"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Mô tả ngắn" name="shortDesc">
        <QuillEditor
          className="short-quill"
          placeholder="Nhập mô tả ngắn gọn, hấp dẫn cho tour..."
        />
      </Form.Item>
    </div>
  );
}

export default Step1Info;
