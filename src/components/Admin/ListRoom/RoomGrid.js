import { Badge, Card, Col, Row } from "antd";

function RoomGrid(props) {
  const { data } = props;
  return (
    <>
      <Row gutter={[15, 15]}>
        {data.map((item) => (
          <Col key={item.id} span={12}>
            <Badge.Ribbon
              text={item.typeRoom ? "VIP" : "Thường"}
              color={item.typeRoom ? "#FFD700" : "#E0E0E0 "}
            >
              <Card title={item.name}>
                <p>
                  Số giường <strong>{item.quantityBed}</strong>
                </p>
                <p>
                  Số người <strong>{item.quantityPeople}</strong>
                </p>
                <p>
                  {item.status ? (
                    <Badge status="success" text="Còn phòng" />
                  ) : (
                    <Badge status="error" text="Hết Phòng" />
                  )}
                </p>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default RoomGrid;
