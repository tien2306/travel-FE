import {
  Button,
  Checkbox,
  Col,
  Input,
  Row,
  Space,
  DatePicker,
  Radio,
  Select,
} from "antd";
import { useState } from "react";
// import { bookRoom } from "../../services/bookRoomService";
const { RangePicker } = DatePicker;

function BookRoom() {
  const [data, setData] = useState({
    time: "14 giờ",
  });

  const handleSbmit = async () => {
    // console.log(data);
    // const res = await bookRoom(data);
    // if (res) {
    //   alert("chúc bạn đã đặt thành công");
    // } else {
    //   alert("xin lỗi, vui lòng đặt lại sau");
    // }
  };

  const handleChange = (e) => {
    // console.log(e);
    const name = e.target.name;
    const value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };
  // console.log(data);

  const handleChangeCheckBox = (e) => {
    // console.log(e);
    setData({
      ...data,
      services: e,
    });
  };

  const handleChangeDate = (dates, dateStrings) => {
    // console.log(dateStrings);

    setData({
      ...data,
      date: dateStrings,
    });
  };

  const optionTimes = [];

  for (let i = 7; i <= 24; i++) {
    optionTimes.push({
      value: i > 9 ? `${i} giờ` : `0${i} giờ`,
      label: i > 9 ? `${i} giờ` : `0${i} giờ`,
    });
  }

  const handleChangeSelect = (e) => {
    // console.log(e);

    setData({
      ...data,
      time: e,
    });
  };

  return (
    <>
      <h2>Đặt phòng</h2>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <p>Họ tên</p>
          <Input
            name="fullname"
            placeholder="Nhập họ tên"
            onChange={handleChange}
          />
        </Col>
        <Col md={12} sm={24} xs={24}>
          <p>Số điện thoại</p>
          <Input
            name="phone"
            placeholder="0123456789"
            onChange={handleChange}
          />
        </Col>
        <Col md={12} sm={24} xs={24}>
          <p>Email</p>
          <Input
            name="email"
            placeholder="nguyenvana@gmail.com"
            onChange={handleChange}
          />
        </Col>

        <Col md={12} sm={24} xs={24}>
          <p>Dịch vụ thêm</p>
          <Checkbox.Group onChange={handleChangeCheckBox}>
            <Space orientation="vertical">
              <Checkbox value="Thuê xe máy">Thuê xe máy</Checkbox>
              <Checkbox value="Thuê ô tô 4 chỗ">Thuê ô tô 4 chỗ</Checkbox>
              <Checkbox value="Thuê ô tô 7 chỗ">Thuê ô tô 7 chỗ</Checkbox>
              <Checkbox value="Thuê ô tô 16 chỗ">Thuê ô tô 16 chỗ</Checkbox>
            </Space>
          </Checkbox.Group>
        </Col>
        <Col md={12} sm={24} xs={24}>
          <p>Quà tặng</p>
          <Radio.Group name="gift" onChange={handleChange}>
            <Space orientation="vertical">
              <Radio value="Áo cộc">Áo cộc</Radio>
              <Radio value="Mũ">Mũ</Radio>
              <Radio value="Dép">Dép</Radio>
              <Radio value="Quần">Quần</Radio>
            </Space>
          </Radio.Group>
        </Col>

        <Col md={12} sm={24} xs={24}>
          <p>Chọn ngày</p>
          <RangePicker
            placeholder={["Ngày đến", "Ngày đi"]}
            format="DD-MM-YYYY"
            onChange={handleChangeDate}
          />
        </Col>

        <Col md={12} sm={24} xs={24}>
          <p>Chọn giờ</p>
          <Select
            defaultValue={data.time}
            style={{ width: "100%" }}
            options={optionTimes}
            onChange={handleChangeSelect}
          />
        </Col>

        <Col span={24}>
          <Button type="primary" onClick={handleSbmit}>
            Đặt Phòng
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default BookRoom;
