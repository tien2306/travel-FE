import { Carousel, Col, Collapse, Image, Rate, Row, Tabs } from "antd";
import CardItem from "../CardItem";

function LearnGrid() {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const items = [
    {
      key: "1",
      label: "This is panel header 1",
      children: <p>{text}</p>,
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: <p>{text}</p>,
    },
    {
      key: "3",
      label: "This is panel header 3",
      children: <p>{text}</p>,
    },
  ];

  const item = [
    {
      key: "1",
      label: "Tab 1",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <>
      {/* <Row gutter={[5, 5]}>
        <Col xxxl={10} xl={10} lg={6} md={2} sm={4} xs={24}>
          <div className="box">
            {" "}
            xxxl={10} xl={10} lg={6} md={2} sm={4} xs={24}
          </div>
        </Col>
        <Col xxxl={6} xl={6} lg={6} md={6} sm={4} xs={24}>
          <div className="box">
            xxxl={6} xl={6} lg={6} md={6} sm={4} xs={24}
          </div>
        </Col>
        <Col xxxl={6} xl={6} lg={6} md={6} sm={4} xs={24}>
          <div className="box">
            xxxl={6} xl={6} lg={6} md={6} sm={4} xs={24}
          </div>
        </Col>
        <Col xxxl={2} xl={2} lg={6} md={10} sm={4} xs={24}>
          <div className="box">
            xxxl={2} xl={2} lg={6} md={10} sm={4} xs={24}
          </div>
        </Col>
      </Row> */}

      <div className="box">
        <Row gutter={[5, 5]}>
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <CardItem title="Box-1" />
          </Col>
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <CardItem title="Box-2" />
          </Col>
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <CardItem title="Box-3" />
          </Col>
          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <CardItem title="Box-4" />
          </Col>
        </Row>

        <Row gutter={[5, 5]} className="mt-20">
          <Col xl={16} lg={16} md={24} sm={24} xs={24}>
            <CardItem title="Box-5" style={{ height: "400px" }} />
          </Col>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <CardItem title="Box-6" style={{ height: "400px" }} />
          </Col>
        </Row>

        <Row gutter={[5, 5]} className="mt-20">
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <CardItem title="Box-7" style={{ height: "400px" }} />
          </Col>
          <Col xl={16} lg={16} md={24} sm={24} xs={24}>
            <CardItem title="Box-8" style={{ height: "400px" }} />
          </Col>
        </Row>

        <Row gutter={[5, 5]} className="mt-20">
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <CardItem title="Box-9" style={{ height: "400px" }} />
          </Col>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <CardItem title="Box-10" style={{ height: "400px" }} />
          </Col>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            <CardItem title="Box-11" style={{ height: "400px" }} />
          </Col>
        </Row>

        <Carousel arrows>
          <div className="slider-item">1</div>
          <div className="slider-item">2</div>
          <div className="slider-item">3</div>
          <div className="slider-item">4</div>
        </Carousel>

        <Collapse accordion items={items} defaultActiveKey={["1"]} />

        <Image
          width={200}
          alt="basic"
          src="https://cellphones.com.vn/sforum/wp-content/uploads/2022/05/12-4.jpg"
        />

        <Tabs items={item}></Tabs>

        <Rate allowHalf />
      </div>
    </>
  );
}

export default LearnGrid;
