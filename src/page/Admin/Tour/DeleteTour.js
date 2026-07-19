import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteTour } from "../../../services/tour";

function DeleteTour(props) {
  const { record, onReload } = props;

  const handleDelete = async () => {
    try {
      const res = await deleteTour(record.key);
      if (res && res.success) {
        message.success("Xóa tour thành công!");
        onReload();
      } else {
        message.error("Xóa tour không thành công!");
      }
    } catch (error) {
      message.error("Lỗi hệ thống khi thực hiện xóa!");
    }
  };

  return (
    <Popconfirm
      title="Bạn có chắc chắn muốn xóa tour này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <Button danger icon={<DeleteOutlined />} />
    </Popconfirm>
  );
}

export default DeleteTour;
