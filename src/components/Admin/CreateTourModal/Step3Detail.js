import { Form } from "antd";
import QuillEditor from "../../Common/QuillEditor";

function Step3Detail() {
  return (
    <div className="form-detail-desc" style={{ marginTop: "20px" }}>
      <Form.Item label="Mô tả chi tiết" name="detailDesc">
        <QuillEditor placeholder="Nhập lịch trình chi tiết, những điểm nổi bật của tour..." />
      </Form.Item>
    </div>
  );
}

export default Step3Detail;
