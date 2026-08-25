import { Form } from "antd";
import TinyEditor from "../../Common/TinyEditor";

function Step3Detail() {
  const rule = [{ required: true, message: "Bắt buộc điền thông tin này!" }];
  return (
    <div className="form-detail-desc" style={{ marginTop: "20px" }}>
      {/* preserve={true}: giữ lại giá trị detailDesc khi component unmount (chuyển bước) */}
      <Form.Item name="detailDesc" preserve={true} rules={rule}>
        <TinyEditor
          className="detail-quill"
          placeholder="Nhập nội dung chi tiết bài viết giới thiệu tour..."
        />
      </Form.Item>
    </div>
  );
}

export default Step3Detail;
