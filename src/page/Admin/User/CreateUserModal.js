import { useState } from "react";
import { Form, Button, Modal, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { createUser } from "../../../services/user";

function CreateUserModal(props) {
  const { onReload } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);

  const handleCancel = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn hủy?",
      text: "Các thông tin chưa lưu sẽ bị mất!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý thoát",
      cancelButtonText: "Tiếp tục chỉnh sửa",
    }).then((result) => {
      if (result.isConfirmed) {
        form.resetFields();
        setShowModal(false);
      }
    });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await createUser(values);
      if (res && res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Tạo người dùng thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        form.resetFields();
        setShowModal(false);
        onReload();
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: res?.message || "Tạo người dùng thất bại!",
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
        Thêm User
      </Button>

      <Modal
        title="Thêm người dùng mới"
        open={showModal}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden={true}
        okText="Tạo mới"
        cancelText="Hủy"
      >
        <Form
          form={form}
          name="create-user"
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ roleId: 2 }}
          autoComplete="off"
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Phân quyền"
            name="roleId"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={2}>USER</Select.Option>
              <Select.Option value={1}>ADMIN</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreateUserModal;
