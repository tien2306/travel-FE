import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { deleteUser } from "../../../services/user";

function DeleteUser(props) {
  const { record, onReload } = props;

  const handleDelete = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteUser(record.key);
          if (res && res.success) {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Xóa người dùng thành công!",
              timer: 1500,
              showConfirmButton: false,
            });
            onReload();
          } else {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: res?.message || "Xóa thất bại!",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Lỗi kết nối hệ thống!",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  return (
    <Button
      danger
      icon={<DeleteOutlined />}
      onClick={handleDelete}
    />
  );
}

export default DeleteUser;
