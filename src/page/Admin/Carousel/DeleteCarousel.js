import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { deleteCarousel } from "../../../services/carousel";

function DeleteCarousel(props) {
  const { record, onReload } = props;

  const handleDelete = async () => {
    try {
      // Gọi API xóa thông qua ID được truyền từ hàng dữ liệu của bảng
      const res = await deleteCarousel(record.key);
      if (res && res.success) {
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Xóa banner thành công!", timer: 1500, showConfirmButton: false });
        onReload(); // Kích hoạt làm mới lại danh sách ở file cha
      } else {
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Xóa banner không thành công!", timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Lỗi hệ thống khi thực hiện xóa!", timer: 1500, showConfirmButton: false });
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
