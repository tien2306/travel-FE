import React from "react";
import { Typography, Table, Card, Tag, Empty } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import { formatDate } from "../../../../helpers/format/format";

const { Title, Text } = Typography;

const PassengerTable = ({ passengers }) => {
  const getPassengerType = (type) => {
    switch (type) {
      case "ADULT":
        return <Tag color="blue">Người lớn</Tag>;
      case "CHILD":
        return <Tag color="cyan">Trẻ em</Tag>;
      case "TODDLER":
        return <Tag color="orange">Trẻ nhỏ</Tag>;
      case "BABY":
        return <Tag color="pink">Em bé</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      render: (type) => getPassengerType(type),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) => (date ? formatDate(date).split(" ")[0] : "N/A"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "N/A",
    },
  ];

  return (
    <>
      <Title level={4} className="section-title" style={{ marginTop: 32 }}>
        <IdcardOutlined /> Danh sách hành khách
      </Title>
      <Card variant="borderless" className="order-detail__table-card">
        {passengers && passengers.length > 0 ? (
          <Table
            dataSource={passengers}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
            scroll={{ x: "max-content" }}
          />
        ) : (
          <Empty
            description="Không có dữ liệu hành khách"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </>
  );
};

export default PassengerTable;
