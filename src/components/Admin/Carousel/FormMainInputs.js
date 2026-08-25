import { Form, Input } from "antd";
const { TextArea } = Input;

function FormMainInputs() {
  const rule = [{ required: true, message: "Bắt buộc điền thông tin này!" }];

  return (
    <div className="form-main-inputs">
      <Form.Item label="Title (Tiêu đề chính)" name="title" rules={rule}>
        <Input
          size="large"
          placeholder="Nhập tiêu đề chính hiển thị chữ lớn trên slide"
        />
      </Form.Item>

      <Form.Item label="Subtitle (Tiêu đề phụ)" name="subtitle">
        <Input size="large" placeholder="Nhập phụ đề nhỏ hiển thị phía trên" />
      </Form.Item>

      <Form.Item label="Description (Đoạn mô tả chi tiết)" name="description">
        <TextArea
          rows={4}
          placeholder="Nhập đoạn mô tả ngắn giới thiệu nội dung trên slide..."
        />
      </Form.Item>
    </div>
  );
}

export default FormMainInputs;
