import { Table, Tag, Tooltip } from "antd";
import DeleteRoom from "./DeleRoom";
import EditRoom from "./EditRoom";

function RoomTable(props) {
  const { onReload, data } = props;

  const columns = [
    {
      title: "Tên Phòng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số giường",
      dataIndex: "quantityBed",
      key: "quantityBed",
    },
    {
      title: "Số người",
      dataIndex: "quantityPeople",
      key: "quantityPeople",
    },
    {
      title: "Loại phòng",
      dataIndex: "typeRoom",
      key: "typeRoom",
      render: (_, record) => {
        // console.log(text, record);

        return (
          <>
            {record.typeRoom ? (
              // <Badge color="yellow" text="VIP" />
              <Tooltip title="Phòng VIP chuẩn 5 sao">
                <Tag color="yellow">VIP</Tag>
              </Tooltip>
            ) : (
              // <Badge color="gray" text="Thường" />
              <Tooltip title="Phòng VIP chuẩn 3 sao">
                <Tag color="gray">Thường</Tag>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        // console.log(text, record);
        return (
          <>
            {record.status ? (
              // <Badge color="green" text="Còn phòng" />
              <Tooltip title="Phòng chưa có khách đặt">
                <Tag color="green">Còn phòng</Tag>
              </Tooltip>
            ) : (
              // <Badge color="red" text="Hết phòng" />
              <Tooltip title="Phòng đã có khách đặt">
                <Tag color="red">Hết phòng</Tag>
              </Tooltip>
            )}
          </>
        );
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        // console.log(text, record);
        return (
          <>
            <DeleteRoom record={record} onReload={onReload} />
            <EditRoom record={record} onReload={onReload} />
          </>
        );
      },
    },
  ];
  return (
    <>
      <Table dataSource={data} rowKey={"id"} columns={columns} />;<></>
    </>
  );
}

export default RoomTable;
