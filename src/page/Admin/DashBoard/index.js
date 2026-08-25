import { useEffect, useState } from "react";
import { Col, Row, Spin, message } from "antd";
import SummaryCards from "../../../components/Admin/Dashboard/SummaryCards";
import TourStatusChart from "../../../components/Admin/Dashboard/TourStatusChart";
import TourCategoryChart from "../../../components/Admin/Dashboard/TourCategoryChart";

import { getUsers } from "../../../services/user";
import { getToursAdmin, getToursFilter } from "../../../services/tour";
import { getCarousel } from "../../../services/carousel";

import "./DashBoard.scss";

function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTours: 0,
    totalCarousels: 0,
    tours: [], // Để vẽ biểu đồ
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Bọc từng request với catch để nếu 1 cái lỗi (vd 400 Bad Request) thì không làm sập toàn bộ
        const [usersRes, toursRes, carouselsRes, toursAllRes] = await Promise.all([
          getUsers(1, 100).catch(() => ({ success: false })),
          getToursAdmin(1).catch(() => ({ success: false })),
          getCarousel(1).catch(() => ({ success: false })),
          // Giảm limit xuống hoặc nếu lỗi thì sẽ fallback về toursRes
          getToursFilter({ page: 1, limit: 20 }).catch(() => ({ success: false })),
        ]);

        let totalUsers = 0;
        if (usersRes?.success) {
          if (usersRes.data?.pagination?.total) {
            totalUsers = usersRes.data.pagination.total;
          } else if (Array.isArray(usersRes.data)) {
            totalUsers = usersRes.data.length;
          } else if (usersRes.data?.items) {
            totalUsers = usersRes.data.items.length;
          }
        }

        let totalTours = 0;
        if (toursRes?.success) {
          totalTours = toursRes.data?.pagination?.total || 0;
        }

        let totalCarousels = 0;
        if (carouselsRes?.success) {
          totalCarousels = carouselsRes.data?.pagination?.total || 0;
        }

        let toursData = [];
        if (toursAllRes?.success) {
          toursData = Array.isArray(toursAllRes.data) ? toursAllRes.data : (toursAllRes.data?.items || []);
        } else if (toursRes?.success) {
          toursData = Array.isArray(toursRes.data) ? toursRes.data : (toursRes.data?.items || []);
        }

        setStats({
          totalUsers,
          totalTours,
          totalCarousels,
          tours: toursData,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        message.error("Lỗi khi tải dữ liệu thống kê!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className="dashboard__header-title">Dashboard Tổng Quan</h2>
        <p className="dashboard__header-sub">
          Xem thống kê số liệu và biểu đồ phân tích hệ thống
        </p>
      </div>

      <SummaryCards
        totalUsers={stats.totalUsers}
        totalTours={stats.totalTours}
        totalCarousels={stats.totalCarousels}
      />

      <div className="dashboard__charts">
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={12}>
            <TourStatusChart tours={stats.tours} />
          </Col>
          <Col xs={24} xl={12}>
            <TourCategoryChart tours={stats.tours} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DashBoard;

