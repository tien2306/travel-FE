import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  message,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Progress,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createTour } from "../../../services/tour";
import "./CreateTour.scss";

function CreateTour() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const rule = [{ required: true, message: "Bắt buộc!" }];

  const getValueFromFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const uploadImage = async (options) => {
    const { onSuccess } = options;
    const fakeProgress = { percent: 0 };

    const intervalUpdateProgress = setInterval(() => {
      fakeProgress.percent += 10;
      setPercent(fakeProgress.percent);
      if (fakeProgress.percent >= 100) {
        clearInterval(intervalUpdateProgress);
        setTimeout(() => {
          onSuccess("ok");
        }, 800);
      }
    }, 200);
  };

  const handleUploadChange = ({ fileList }) => {
    setImg(fileList);
  };

  useEffect(() => {
    const thumb = document.querySelector(".upload-item img");
    if (thumb) thumb.style.width = "100%";
  }, [img]);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", e.name);
      formData.append("quantityBed", e.quantityBed || 0);
      formData.append("quantityPeople", e.quantityPeople || 0);
      formData.append("description", e.description || "");
      formData.append("utils", e.utils || "");
      formData.append("typeRoom", e.typeRoom || "Thường");
      formData.append("isActive", e.isActive ?? true);

      if (e.image && e.image[0] && e.image[0].originFileObj) {
        formData.append("image", e.image[0].originFileObj);
      }

      const res = await createTour(formData);

      if (res && res.success) {
        form.resetFields();
        setImg(null);
        setPercent(0);
        messageApi.open({
          type: "success",
          content: "Tạo mới tour thành công!",
        });
        setTimeout(() => navigate("/admin/list-tour"), 1000);
      } else {
        messageApi.open({
          type: "error",
          content: "Tạo mới không thành công!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Lỗi hệ thống!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-tour">
      {contextHolder}
      <div className="create-tour-container">
        <div>
          <h2 className="create-tour-title">Thêm Tour mới</h2>
          <p className="create-tour-sub">
            Quản lý tours và trạng thái hiển thị
          </p>
        </div>
      </div>

      <Form
        name="create-tour"
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
      >
        <Form.Item label="Tên Tour" name="name" rules={rule}>
          <Input placeholder="Nhập tên tour" />
        </Form.Item>

        <Form.Item label="Số lượng giường" name="quantityBed">
          <InputNumber min={1} max={16} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Số người tối đa" name="quantityPeople">
          <InputNumber min={1} max={16} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Loại phòng" name="typeRoom">
          <Select
            placeholder="Chọn loại phòng"
            options={[
              { value: "VIP", label: "VIP" },
              { value: "Thường", label: "Thường" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={getValueFromFile}
        >
          <Upload
            customRequest={uploadImage}
            listType="picture"
            maxCount={1}
            accept="image/*"
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {percent !== 0 && percent !== 100 && (
            <Progress
              className="upload-progress"
              percent={percent}
              strokeColor="#0057FF"
            />
          )}
        </Form.Item>

        <Form.Item label="Tiện ích" name="utils">
          <Input placeholder="Ví dụ: wifi, máy lạnh, tivi..." />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả chi tiết" rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateTour;
