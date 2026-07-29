import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { deleteTour } from "../../../services/tour";

function DeleteTour(props) {
  const { record, onReload } = props;

  const handleDelete = async () => {
    try {
      const res = await deleteTour(record.key);
      if (res && res.success) {
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Xóa tour thành công!", timer: 1500, showConfirmButton: false });
        onReload();
      } else {
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Xóa tour không thành công!", timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Lỗi hệ thống khi thực hiện xóa!", timer: 1500, showConfirmButton: false });
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
