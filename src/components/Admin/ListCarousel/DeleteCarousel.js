import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteCarousel } from "../../../services/carousel";

function DeleteCarousel(props) {
  const { record, onReload } = props;

  const handleDelete = async () => {
    try {
      // Gọi API xóa thông qua ID được truyền từ hàng dữ liệu của bảng
      const res = await deleteCarousel(record.key);
      if (res && res.success) {
        message.success("Xóa banner thành công!");
        onReload(); // Kích hoạt làm mới lại danh sách ở file cha
      } else {
        message.error("Xóa banner không thành công!");
      }
    } catch (error) {
      message.error("Lỗi hệ thống khi thực hiện xóa!");
    }
  };

  return (
    <Popconfirm
      title="Bạn có chắc chắn muốn xóa banner này?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <Button danger icon={<DeleteOutlined />} />
    </Popconfirm>
  );
}

export default DeleteCarousel;
