import { Form, Input, InputNumber, Row, Col } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
const { TextArea } = Input;

function FormMainInputs() {
  const rule = [{ required: true, message: "Bắt buộc điền thông tin này!" }];

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }], // Thêm tính năng chọn cỡ chữ
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="form-main-inputs">
      <Form.Item label="Tên tour" name="name" rules={rule}>
        <Input size="large" placeholder="Nhập tên tour" />
      </Form.Item>

      <Form.Item
        label="Slug"
        name="slug"
        tooltip="Đường dẫn thân thiện cho SEO (vd: tour-da-lat-3-ngay)"
      >
        <Input size="large" placeholder="Nhập slug (tự sinh nếu bỏ trống)" />
      </Form.Item>

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
          <Form.Item label="Đã bán" name="sold">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              size="large"
              placeholder="Số lượng đã bán"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Nơi khởi hành" name="departurePlace">
            <Input size="large" placeholder="Ví dụ: TP. Hồ Chí Minh" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Điểm đến" name="destination">
        <Input size="large" placeholder="Ví dụ: Đà Lạt, Nha Trang..." />
      </Form.Item>

      <Form.Item label="Mô tả ngắn" name="shortDesc">
        <TextArea
          rows={2}
          placeholder="Nhập mô tả ngắn gọn, hấp dẫn cho tour"
        />
      </Form.Item>

      <Form.Item 
        label="Mô tả chi tiết" 
        name="detailDesc"
      >
        <ReactQuill 
          theme="snow" 
          modules={quillModules}
          placeholder="Nhập lịch trình chi tiết, những điểm nổi bật của tour..." 
        />
      </Form.Item>
    </div>
  );
}

export default FormMainInputs;
