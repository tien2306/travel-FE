import { Column } from "@ant-design/charts";
import { useEffect, useState } from "react";

function TourStatusChart({ tours = [] }) {
  // 1. Hook theo dõi sự thay đổi Dark/Light mode trên thẻ <html>
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    // Tạo một MutationObserver để theo dõi khi thuộc tính data-theme thay đổi
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Đếm số lượng tour theo từng trạng thái
  const statusCounts = tours.reduce((acc, tour) => {
    const status = tour.status || "UNKNOWN";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map((status) => ({
    status: status,
    count: statusCounts[status],
  }));

  const config = {
    // Tự động sử dụng giao diện Dark/Light có sẵn của thư viện
    theme: isDarkMode ? "dark" : "light",
    // Nguồn dữ liệu truyền vào biểu đồ
    data,
    // Trục X (nằm ngang) sẽ lấy thuộc tính 'status' làm nhãn
    xField: "status",
    // Trục Y (nằm dọc) sẽ biểu diễn độ cao cột theo 'count'
    yField: "count",
    // Thuộc tính dùng để phân loại màu sắc cho cột
    colorField: "status",
    
    // Cấu hình nhãn (chữ hiển thị trên đầu mỗi cột)
    label: {
      text: (d) => `${d.count}`, // Nội dung chữ là con số count
      textBaseline: "bottom", // Vị trí chữ nằm ở trên đỉnh cột
    },

    // Hàm quy định màu sắc cho từng cột dựa vào giá trị status
    color: ({ status }) => {
      if (status === "ACTIVE") return "#52c41a"; // Màu xanh lá cho ACTIVE
      if (status === "INACTIVE") return "#fa8c16"; // Màu cam cho INACTIVE
      if (status === "CLOSED") return "#8c8c8c"; // Màu xám cho CLOSED
      return "#1890ff"; // Màu xanh dương mặc định
    },
    // Tắt chú giải (chú thích) vì trục X đã ghi rõ tên trạng thái rồi
    legend: false,
  };

  return (
    <div className="dashboard__chart-wrapper">
      <h3 className="dashboard__chart-wrapper-title">
        Thống kê Tour theo trạng thái
      </h3>
      <Column {...config} height={300} />
    </div>
  );
}

export default TourStatusChart;
