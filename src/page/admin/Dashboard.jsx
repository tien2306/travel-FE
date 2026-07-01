import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { Alert, Card, Statistic, Table, Tag, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getTours } from "../../services/tourService";

const { Text, Title } = Typography;

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

function getDuration(startDate, endDate) {
  if (!startDate || !endDate) {
    return "N/A";
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  return days > 0 ? `${days} days` : "N/A";
}

async function loadAllTours() {
  const firstResponse = await getTours(1);

  if (!firstResponse?.success) {
    return {
      success: false,
      message: firstResponse?.message || "Unable to load tours",
      items: [],
    };
  }

  const firstItems = firstResponse.data?.items || [];
  const totalPages = firstResponse.data?.pagination?.totalPages || 1;

  if (totalPages <= 1) {
    return {
      success: true,
      items: firstItems,
    };
  }

  const restResponses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => getTours(index + 2)),
  );

  const restItems = restResponses.flatMap((response) => response?.data?.items || []);

  return {
    success: true,
    items: [...firstItems, ...restItems],
  };
}

function Dashboard() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setApiError("");

      try {
        const response = await loadAllTours();

        if (!response.success) {
          setApiError(response.message);
          message.error(response.message);
          return;
        }

        setTours(response.items);
      } catch (error) {
        setApiError("Cannot connect to dashboard API");
        message.error("Cannot connect to dashboard API");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardStats = useMemo(() => {
    const totalRevenue = tours.reduce((sum, tour) => {
      return sum + Number(tour.price || 0) * Number(tour.sold || 0);
    }, 0);

    const activeBookings = tours.reduce((sum, tour) => {
      return sum + Number(tour.sold || 0);
    }, 0);

    const activeTours = tours.filter((tour) => tour.status === "ACTIVE").length;

    return [
      {
        title: "Total Revenue",
        value: totalRevenue,
        formatter: (value) => currencyFormatter.format(Number(value || 0)),
        note: "Calculated from sold tour seats",
        icon: <DollarOutlined />,
      },
      {
        title: "Active Bookings",
        value: activeBookings,
        note: "Sold seats from live tours",
        icon: <CalendarOutlined />,
      },
      {
        title: "Total Tours",
        value: activeTours,
        note: `${tours.length} tours loaded`,
        icon: <CompassOutlined />,
      },
      {
        title: "System Users",
        value: "N/A",
        note: "Users API is not available yet",
        icon: <TeamOutlined />,
      },
    ];
  }, [tours]);

  const tourColumns = [
    {
      title: "Tour ID",
      dataIndex: "id",
      key: "id",
      width: 170,
      render: (value) => <Text code>{String(value).slice(0, 8)}</Text>,
    },
    {
      title: "Tour Name",
      dataIndex: "name",
      key: "name",
      width: 260,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
      width: 160,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (value) => <Text strong>{currencyFormatter.format(Number(value || 0))}</Text>,
    },
    {
      title: "Sold",
      dataIndex: "sold",
      key: "sold",
      width: 110,
      render: (sold, record) => `${sold || 0}/${record.quantity || 0}`,
    },
    {
      title: "Duration",
      key: "duration",
      width: 120,
      render: (_, record) => <Tag color="blue">{getDuration(record.startDate, record.endDate)}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={status === "ACTIVE" ? "success" : "default"}
          icon={status === "ACTIVE" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="admin-page">
      {apiError && (
        <Alert
          type="error"
          showIcon
          message="Dashboard data could not be loaded"
          description={apiError}
        />
      )}

      <section className="admin-stats-grid">
        {dashboardStats.map((item) => (
          <Card key={item.title} className="admin-stat-card" loading={loading}>
            <div className="admin-stat-card__content">
              <Statistic
                title={item.title}
                value={item.value}
                formatter={item.formatter}
              />
              <div className="admin-stat-card__icon">{item.icon}</div>
            </div>
            <Text className="admin-stat-card__trend">{item.note}</Text>
          </Card>
        ))}
      </section>

      <Card
        className="admin-table-card"
        title={
          <div>
            <Title level={4} className="admin-page__title">
              Live Tour Performance
            </Title>
            <Text className="admin-page__subtitle">
              This table uses real data from the tours API.
            </Text>
          </div>
        }
      >
        <Table
          rowKey="id"
          columns={tourColumns}
          dataSource={tours.slice(0, 8)}
          loading={loading}
          pagination={false}
          scroll={{ x: 1090 }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
