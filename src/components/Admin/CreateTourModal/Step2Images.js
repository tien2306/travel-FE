import { Form, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function Step2Images(props) {
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
    <div className="step-content-container">
      <Form.Item
        label="Thumbnail (Ảnh đại diện tour)"
        name="thumbnail"
        valuePropName="fileList"
        getValueFromEvent={getValueFromFile}
        className="upload-form-item"
      >
        <Upload
          maxCount={1}
          beforeUpload={() => false}
          listType="picture-card"
          onChange={onThumbnailChange}
          onPreview={onPreview}
          fileList={thumbnailFileList}
          className="tour-uploader large-uploader"
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
          className="tour-uploader large-uploader"
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

export default Step2Images;
