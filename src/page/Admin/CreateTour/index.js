import {
  message,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { createTour } from "../../../services/tourService";

function CreateRoom() {
  const rule = [{ required: true, message: "Bắt buộc" }];
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const options = [
    { label: "wifi", value: "wifi" },
    { label: "máy lạnh", value: "máy lạnh" },
    { label: "tivi", value: "tivi" },
    { label: "view biển", value: "view biển" },
  ];
  const handleSubmit = async (e) => {
    // console.log(e);
    const res = await createTour(e);
    if (res) {
      form.resetFields();
      messageApi.open({
        type: "success",
        content: "Tạo mới thành công",
      });
    } else {
      messageApi.open({
        type: "error",
        content: "Tạo mới không thành công",
      });
    }
  };
  return (
    <>
      {contextHolder}
      <h2>Thêm phòng mới</h2>
      <Form name="create-room" onFinish={handleSubmit} form={form}>
        <Form.Item label="Tên Phòng" name="name" rules={rule}>
          <Input />
        </Form.Item>

        <Form.Item label="Số lượng giường" name="quantityBed" rules={rule}>
          <InputNumber min={1} max={16} />
        </Form.Item>

        <Form.Item label="Số người tối đa" name="quantityPeople" rules={rule}>
          <InputNumber min={1} max={16} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="tiện ích" name="utils">
          <Select mode="multiple" options={options} allowClear />
        </Form.Item>

        <Form.Item label="Trạng thái" valuePropName="checked" name="status">
          <Switch checkedChildren="Còn Phòng" unCheckedChildren="Hết Phòng" />
        </Form.Item>

        <Form.Item label="Loại Phòng" valuePropName="checked" name="typeRoom">
          <Switch checkedChildren="VIP" unCheckedChildren="Thường" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CreateRoom;
