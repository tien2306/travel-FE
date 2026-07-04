import { Form, InputNumber, Switch, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function FormSideConfigs(props) {
  const { fileList, onPreview, onUploadChange } = props;
  const rule = [{ required: true, message: "Bắt buộc điền thông tin này!" }];

  // Hàm hỗ trợ xử lý dữ liệu ảnh khi người dùng chọn tệp.
  // Antd cần hàm này để chuyển đổi sự kiện (event) upload thành một mảng fileList sạch.
  const getValueFromFile = (e) => {
    // Trường hợp 1: Nếu dữ liệu truyền vào đã là một mảng sẵn rồi thì giữ nguyên và trả về luôn
    if (Array.isArray(e)) {
      return e;
    }
    // Trường hợp 2: Nếu 'e' tồn tại (không bị null/undefined) thì lấy mảng 'fileList' bên trong nó,
    // ngược lại nếu 'e' trống rỗng thì trả về undefined để tránh lỗi crash ứng dụng.
    return e && e.fileList;
  };

  return (
    <div className="form-side-configs">
      <div className="inline-config-row">
        <Form.Item
          label="Thứ tự hiển thị"
          name="sortOrder"
          className="config-item"
        >
          <InputNumber min={0} size="large" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          valuePropName="checked"
          name="isActive"
          className="config-item switch-box"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </div>

      <Form.Item
        label="Tệp hình ảnh banner"
        name="image"
        valuePropName="fileList"
        getValueFromEvent={getValueFromFile}
        rules={rule}
        className="upload-form-item"
      >
        <Upload
          maxCount={1}
          beforeUpload={() => false}
          listType="picture-card"
          onPreview={onPreview}
          onChange={onUploadChange}
          fileList={fileList}
          className="banner-uploader"
        >
          {fileList.length >= 1 ? null : (
            <div className="upload-btn-inner">
              <UploadOutlined className="icon-blue" />
              <div className="upload-text">Chọn tệp ảnh</div>
            </div>
          )}
        </Upload>
      </Form.Item>
    </div>
  );
}

export default FormSideConfigs;
