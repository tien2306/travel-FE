import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteTour } from "../../../services/tourService";

function DeleteRoom(props) {
  const { record, onReload } = props;
  const handleDelete = async () => {
    console.log(record.id);
    const res = await deleteTour(record.id);
    if (res) {
      alert("xóa thành công");
      onReload();
    } else {
      alert("Xóa ko thành công");
    }
  };
  return (
    <>
      <Popconfirm title="Sure to delete?" onConfirm={handleDelete}>
        <Button danger icon={<DeleteOutlined />}></Button>
      </Popconfirm>
    </>
  );
}
export default DeleteRoom;
