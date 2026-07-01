import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  createTour,
  deleteTour,
  getTours,
  updateTour,
} from "../../services/tourService";

const { Text, Title } = Typography;

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const statusOptions = [
  {
    value: "ACTIVE",
    label: "ACTIVE",
  },
  {
    value: "INACTIVE",
    label: "INACTIVE",
  },
];

function getDuration(startDate, endDate) {
  if (!startDate || !endDate) {
    return "N/A";
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const days = end.diff(start, "day") + 1;

  return days > 0 ? `${days} days` : "N/A";
}

function normalizeTourPayload(values) {
  return {
    name: values.name.trim(),
    departurePlace: values.departurePlace.trim(),
    destination: values.destination.trim(),
    price: String(values.price),
    quantity: values.quantity,
    startDate: values.startDate.toISOString(),
    endDate: values.endDate.toISOString(),
    status: values.status,
    shortDesc: values.shortDesc?.trim() || "",
    detailDesc: values.detailDesc?.trim() || "",
    image: values.image?.trim() || null,
  };
}

function TourManagement() {
  const [form] = Form.useForm();
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingTourId, setDeletingTourId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  const fetchTours = async (page = 1) => {
    setLoading(true);

    try {
      const response = await getTours(page);

      if (!response?.success) {
        message.error(response?.message || "Unable to load tours");
        setTours([]);
        return;
      }

      const items = response.data?.items || [];
      const serverPagination = response.data?.pagination;

      setTours(items);
      setPagination((current) => ({
        ...current,
        current: serverPagination?.page || page,
        pageSize: serverPagination?.limit || current.pageSize,
        total: serverPagination?.total || items.length,
      }));
    } catch (error) {
      message.error("Cannot connect to tours API");
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours(1);
  }, []);

  const filteredTours = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return tours;
    }

    return tours.filter((tour) =>
      [
        tour.name,
        tour.departurePlace,
        tour.destination,
        tour.status,
        tour.shortDesc,
      ].some((field) => String(field || "").toLowerCase().includes(keyword)),
    );
  }, [searchQuery, tours]);

  const openAddModal = () => {
    setEditingTour(null);
    form.resetFields();
    form.setFieldsValue({
      status: "ACTIVE",
    });
    setModalOpen(true);
  };

  const openEditModal = (tour) => {
    setEditingTour(tour);
    form.setFieldsValue({
      name: tour.name,
      departurePlace: tour.departurePlace,
      destination: tour.destination,
      price: Number(tour.price),
      quantity: tour.quantity,
      startDate: tour.startDate ? dayjs(tour.startDate) : null,
      endDate: tour.endDate ? dayjs(tour.endDate) : null,
      status: tour.status || "ACTIVE",
      shortDesc: tour.shortDesc,
      detailDesc: tour.detailDesc,
      image: tour.image,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTour(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = normalizeTourPayload(values);

    setSubmitting(true);

    try {
      const response = editingTour
        ? await updateTour(editingTour.id, payload)
        : await createTour(payload);

      if (!response?.success) {
        message.error(response?.message || "Unable to save tour");
        return;
      }

      message.success(editingTour ? "Tour updated successfully" : "New tour added successfully");
      closeModal();
      fetchTours(pagination.current);
    } catch (error) {
      message.error("Cannot connect to tours API");
    } finally {
      setSubmitting(false);
    }
  };

  const setTourInactive = async (tour) => {
    const response = await updateTour(tour.id, { status: "INACTIVE" });

    if (!response?.success) {
      message.error(
        response?.status
          ? `${response.status}: ${response.message || "Unable to set tour inactive"}`
          : response?.message || "Unable to set tour inactive",
      );
      return;
    }

    message.success("Tour set to inactive");
    fetchTours(pagination.current);
  };

  const handleDelete = async (tour) => {
    setDeletingTourId(tour.id);

    try {
      const response = await deleteTour(tour.id);

      if (!response?.success) {
        if (response?.status === 400) {
          Modal.confirm({
            title: "Cannot hard delete this tour",
            content:
              "The backend rejected this delete request. This usually happens when an existing tour has related records. Set it to INACTIVE instead?",
            okText: "Set inactive",
            cancelText: "Cancel",
            onOk: () => setTourInactive(tour),
          });
          return;
        }

        message.error(
          response?.status
            ? `${response.status}: ${response.message || "Unable to delete tour"}`
            : response?.message || "Unable to delete tour",
        );
        return;
      }

      message.success("Tour deleted successfully");
      fetchTours(pagination.current);
    } catch (error) {
      message.error("Cannot connect to tours API");
    } finally {
      setDeletingTourId("");
    }
  };

  const columns = [
    {
      title: "Tour Title",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <div>
            <Text type="secondary">{record.shortDesc || "No description"}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Route",
      key: "route",
      width: 240,
      render: (_, record) => (
        <span>
          {record.departurePlace} to {record.destination}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (value) => <Text strong>{currencyFormatter.format(Number(value || 0))}</Text>,
    },
    {
      title: "Duration",
      key: "duration",
      width: 130,
      render: (_, record) => <Tag color="blue">{getDuration(record.startDate, record.endDate)}</Tag>,
    },
    {
      title: "Capacity",
      key: "capacity",
      width: 160,
      render: (_, record) => `${record.sold || 0}/${record.quantity || 0} guests`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "success" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            aria-label={`Edit ${record.name}`}
          />
          <Tooltip
            title={
              Number(record.sold || 0) > 0
                ? "This tour has sold seats; hard delete may be rejected by backend"
                : ""
            }
          >
            <Popconfirm
              title="Delete tour"
              description={`Delete ${record.name}?`}
              okText="Delete"
              okButtonProps={{
                danger: true,
                loading: deletingTourId === record.id,
              }}
              onConfirm={() => handleDelete(record)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                aria-label={`Delete ${record.name}`}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <Card className="admin-table-card">
        <div className="admin-tour-toolbar">
          <div>
            <Title level={4} className="admin-page__title">
              Travel Packages
            </Title>
            <Text className="admin-page__subtitle">
              Data is loaded from the live tours API.
            </Text>
          </div>

          <div className="admin-tour-toolbar__actions">
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="admin-tour-toolbar__search"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
              Add New Tour
            </Button>
          </div>
        </div>
      </Card>

      <Card className="admin-table-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredTours}
          loading={loading}
          scroll={{ x: 1210 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: searchQuery ? filteredTours.length : pagination.total,
            showSizeChanger: false,
            onChange: (page) => fetchTours(page),
          }}
        />
      </Card>

      <Modal
        title={editingTour ? "Edit Tour" : "Add New Tour"}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText={editingTour ? "Save Changes" : "Create Tour"}
        confirmLoading={submitting}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            label="Tour Title"
            name="name"
            rules={[
              { required: true, message: "Tour title is required" },
              { min: 3, message: "Tour title must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Tour Da Nang 3N2D" />
          </Form.Item>

          <Form.Item
            label="Departure Place"
            name="departurePlace"
            rules={[{ required: true, message: "Departure place is required" }]}
          >
            <Input placeholder="Ho Chi Minh City" />
          </Form.Item>

          <Form.Item
            label="Destination"
            name="destination"
            rules={[{ required: true, message: "Destination is required" }]}
          >
            <Input placeholder="Da Nang" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Price is required" },
              {
                type: "number",
                min: 1,
                message: "Price must be greater than 0",
              },
            ]}
          >
            <InputNumber
              min={1}
              precision={0}
              style={{ width: "100%" }}
              placeholder="3500000"
            />
          </Form.Item>

          <Form.Item
            label="Max Capacity"
            name="quantity"
            rules={[
              { required: true, message: "Max capacity is required" },
              {
                type: "number",
                min: 1,
                message: "Max capacity must be above 0",
              },
            ]}
          >
            <InputNumber min={1} precision={0} style={{ width: "100%" }} placeholder="30" />
          </Form.Item>

          <Space size={12} style={{ width: "100%" }} align="start">
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Start date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              dependencies={["startDate"]}
              rules={[
                { required: true, message: "End date is required" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("startDate");

                    if (!value || !startDate || value.isSame(startDate) || value.isAfter(startDate)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("End date must be after start date"));
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="https://example.com/tour-image.jpg" />
          </Form.Item>

          <Form.Item label="Short Description" name="shortDesc">
            <Input.TextArea rows={2} placeholder="Short tour summary" />
          </Form.Item>

          <Form.Item label="Detail Description" name="detailDesc">
            <Input.TextArea rows={3} placeholder="Detailed itinerary" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TourManagement;
