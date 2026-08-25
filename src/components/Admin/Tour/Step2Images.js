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
      {/* Thumnail */}
      <Form.Item
        label="Thumbnail (Ảnh đại diện tour)"
        name="thumbnail"
        valuePropName="fileList" //Bảo form,item vào thuộc tính fileList của Upload để lấy dữ liệu
        getValueFromEvent={getValueFromFile} //Định nghĩa cách gom dữ liệu khi người dùng chọn ảnh
        className="upload-form-item"
      >
        <Upload
          maxCount={1}
          beforeUpload={() => false} // chặn antd tự gửi ảnh lên server khi chọn ảnh xong
          listType="picture-card" // định nghĩa khung ảnh chọn là hình vuông
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

      {/* Images */}
      <Form.Item
        label="Thư viện ảnh (Images)"
        name="images"
        valuePropName="fileList" //Bảo form,item vào thuộc tính fileList của Upload để lấy dữ liệu
        getValueFromEvent={getValueFromFile} //Định nghĩa cách gom dữ liệu khi người dùng chọn ảnh
        className="upload-form-item"
      >
        <Upload
          multiple
          beforeUpload={() => false} // chặn antd tự gửi ảnh lên server khi chọn ảnh xong
          listType="picture-card" // định nghĩa khung ảnh chọn là hình vuông
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
