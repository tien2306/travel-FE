import React from "react";
import { Modal, Form, Card, Row, Col, Input, DatePicker, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

const PassengerModal = ({ isOpen, onClose, modalForm, form }) => {
  const handleConfirm = () => {
    modalForm
      .validateFields() // 1. Kiểm tra xem bạn đã gõ đủ tên và ngày sinh chưa
      .then((values) => {
        // 2. Nếu đủ rồi, nó bốc toàn bộ dữ liệu từ Form nháp ĐỔ VÀO Form chính
        // values.passengers  là KQ của modalForm.validateFields()
        // xử lí xong nó trả về 1 object chứa passengers
        form.setFieldsValue({ passengers: values.passengers });

        // 3. Đóng Modal lại
        onClose();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Nhập thông tin hành khách"
      open={isOpen}
      onCancel={onClose}
      width={800}
      centered
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleConfirm}>
          Xác nhận
        </Button>,
      ]}
    >
      <Form form={modalForm} layout="vertical">
        <div className="passengers-modal-list">
          <Form.List name="passengers">
            {(fields) => (
              <div className="passengers">
                {/* giá trị name của antd ở đây như index - thứ tự  */}
                {fields.map(({ key, name, ...restField }, index) => {
                  const type = modalForm.getFieldValue([
                    "passengers", // 1. Đi vào cái túi có tên là 'passengers'
                    name, // 2. Tìm cái người ở số thứ tự 'name' (ví dụ 0, 1, 2)
                    "type", // 3. Lôi cái thuộc tính 'type' của người đó ra
                  ]);
                  const typeLabels = {
                    ADULT: "Người lớn",
                    CHILD: "Trẻ em",
                    TODDLER: "Trẻ nhỏ",
                    BABY: "Em bé",
                  };
                  const typeAges = {
                    ADULT: "(Từ 12 tuổi trở lên)",
                    CHILD: "(Từ 5 - 11 tuổi)",
                    TODDLER: "(Từ 2 - 4 tuổi)",
                    BABY: "(Dưới 2 tuổi)",
                  };

                  return (
                    <Card
                      key={key}
                      className="card p-card"
                      variant={false}
                      style={{ marginBottom: 16 }}
                    >
                      <div className="p-card__head">
                        <UserOutlined className="p-card__icon" />
                        <span className="p-card__type">
                          Khách #{index + 1}: {typeLabels[type]}
                        </span>
                        <span className="p-card__age">{typeAges[type]}</span>
                      </div>
                      <Row gutter={16}>
                        <Col xs={24} md={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "fullName"]}
                            label="Họ tên"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập họ tên",
                              },
                            ]}
                          >
                            <Input placeholder="Vd: Nguyễn Văn A" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "dateOfBirth"]}
                            label="Ngày sinh"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn ngày sinh",
                              },
                            ]}
                          >
                            <DatePicker
                              format="DD/MM/YYYY"
                              style={{ width: "100%" }}
                              placeholder="Chọn ngày sinh"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "phone"]}
                            label="Số điện thoại"
                          >
                            <Input placeholder="Vd: 0123456789" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item {...restField} name={[name, "type"]} hidden>
                        <Input />
                      </Form.Item>
                    </Card>
                  );
                })}
              </div>
            )}
          </Form.List>
        </div>
      </Form>
    </Modal>
  );
};

export default PassengerModal;
