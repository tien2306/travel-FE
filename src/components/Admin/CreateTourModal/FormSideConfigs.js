import { Form, DatePicker, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function FormSideConfigs(props) {
  const {
    thumbnailFileList,
    imagesFileList,
    onThumbnailChange,
    onImagesChange,
    onPreview,
  } = props;

  // Hàm hỗ trợ xử lý dữ liệu upload khi người dùng chọn tệp
  const getValueFromFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  return (
    <div className="form-side-configs">
      <div className="inline-config-row">
        <Form.Item
          label="Ngày khởi hành"
          name="startDate"
          className="config-item"
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày đi"
          />
        </Form.Item>

        <Form.Item label="Ngày kết thúc" name="endDate" className="config-item">
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày về"
          />
        </Form.Item>
      </div>

      <Form.Item label="Trạng thái" name="status" className="config-item">
        <Select
          size="large"
          options={[
            { value: "ACTIVE", label: "Đang hoạt động" },
            { value: "INACTIVE", label: "Ngừng hoạt động" },
            { value: "CLOSED", label: "Đã đóng" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Dòng tour" name="category" className="config-item">
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

      <Form.Item label="Phương tiện" name="transport" className="config-item">
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

      <Form.Item
        label="Thumbnail (Ảnh đại diện tour)"
        name="thumbnail"
        valuePropName="fileList" // 🌟 Mẹo 1: Bảo Form.Item hãy vào thuộc tính 'fileList' của Upload để lấy dữ liệu
        getValueFromEvent={getValueFromFile} // 🌟 Mẹo 2: Định nghĩa cách gom dữ liệu khi người dùng chọn ảnh
        // rules={[{ required: false, message: "Vui lòng chọn ảnh thumbnail!" }]}
        className="upload-form-item"
      >
        <Upload
          maxCount={1}
          beforeUpload={() => false}
          listType="picture-card"
          onChange={onThumbnailChange}
          onPreview={onPreview}
          fileList={thumbnailFileList}
          className="tour-uploader"
        >
          {thumbnailFileList.length >= 1 ? null : (
            <div className="upload-btn-inner">
              <UploadOutlined className="icon-blue" />
              <div className="upload-text">Chọn ảnh thumbnail</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item
        label="Thư viện ảnh (Images)"
        name="images"
        valuePropName="fileList"
        getValueFromEvent={getValueFromFile}
        className="upload-form-item"
      >
        <Upload
          multiple
          beforeUpload={() => false}
          listType="picture-card"
          onChange={onImagesChange}
          onPreview={onPreview}
          fileList={imagesFileList}
          className="tour-uploader"
        >
          <div className="upload-btn-inner">
            <UploadOutlined className="icon-blue" />
            <div className="upload-text">
              {imagesFileList.length > 0
                ? "Thêm ảnh khác"
                : "Chọn nhiều ảnh cho tour"}
            </div>
          </div>
        </Upload>
      </Form.Item>
    </div>
  );
}

export default FormSideConfigs;
