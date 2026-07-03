import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  message,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Modal,
  Button,
  Spin,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { updateTour } from "../../../services/tourService";

function EditRoom(props) {
  const [showModal, setShowModal] = useState(false);
  const rule = [{ required: true, message: "Bắt buộc" }];
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { record, onReload } = props;
  const [spinning, setSpinning] = useState(false);
  //   console.log(record);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
  };

  const options = [
    { label: "wifi", value: "wifi" },
    { label: "máy lạnh", value: "máy lạnh" },
    { label: "tivi", value: "tivi" },
    { label: "view biển", value: "view biển" },
  ];
  const handleSubmit = async (e) => {
    // console.log(e);
    setSpinning(true);

    const res = await updateTour(e, record.id);
    // const res = undefined;
    setTimeout(() => {
      if (res) {
        messageApi.open({
          type: "success",
          content: "Cập nhật thành công",
        });
        setShowModal(false);
        onReload();
      } else {
        messageApi.open({
          type: "error",
          content: "Cập nhật không thành công",
        });
      }
      setSpinning(false);
    }, 3000);
  };

  return (
    <>
      {contextHolder}
      <Button
        size="small"
        type="primary"
        icon={<EditOutlined />}
        onClick={handleShowModal}
      />
      <Modal
        title="Chỉnh sửa phòng"
        open={showModal}
        onCancel={handleCancel}
        footer={null}
      >
        <Spin description="Loading..." spinning={spinning}>
          <Form
            name="create-room"
            initialValues={record}
            onFinish={handleSubmit}
            form={form}
          >
            <Form.Item label="Tên Phòng" name="name" rules={rule}>
              <Input />
            </Form.Item>

            <Form.Item label="Số lượng giường" name="quantityBed" rules={rule}>
              <InputNumber min={1} max={16} />
            </Form.Item>

            <Form.Item
              label="Số người tối đa"
              name="quantityPeople"
              rules={rule}
            >
              <InputNumber min={1} max={16} />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="tiện ích" name="utils">
              <Select mode="multiple" options={options} allowClear />
            </Form.Item>

            <Form.Item label="Trạng thái" valuePropName="checked" name="status">
              <Switch
                checkedChildren="Còn Phòng"
                unCheckedChildren="Hết Phòng"
              />
            </Form.Item>

            <Form.Item
              label="Loại Phòng"
              valuePropName="checked"
              name="typeRoom"
            >
              <Switch checkedChildren="VIP" unCheckedChildren="Thường" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}

export default EditRoom;
