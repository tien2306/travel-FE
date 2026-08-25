import { Pie } from "@ant-design/charts";
import { useEffect, useState } from "react";

function TourCategoryChart({ tours = [] }) {
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

  // Đếm số lượng tour theo từng loại (category)
  const categoryCounts = tours.reduce((acc, tour) => {
    // Lấy tên danh mục, hoặc hiển thị "Khác" nếu không có
    const categoryName = tour.category?.title || tour.category || "Chưa phân loại";
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(categoryCounts).map((category) => ({
    category: category,
    value: categoryCounts[category],
  }));

  const config = {
    // Tự động sử dụng giao diện Dark/Light có sẵn của thư viện
    theme: isDarkMode ? "dark" : "light",
    // Nguồn dữ liệu truyền vào biểu đồ
    data,
    // Trường góc độ của bánh tương ứng với giá trị value (số lượng)
    angleField: "value",
    // Trường phân loại màu sắc sẽ chia theo danh mục (category)
    colorField: "category",
    // Bán kính ngoài của biểu đồ (80% không gian)
    radius: 0.8,
    // Bán kính trong để tạo thành biểu đồ Donut (60% bị làm rỗng)
    innerRadius: 0.6,
    
    // Cấu hình nhãn hiển thị trên từng miếng bánh
    label: {
      text: "value", // Hiển thị số lượng
      style: {
        fontWeight: "bold", // In đậm số lượng
      },
    },
    // Ghi chú: Chú giải (Legend) sẽ tự động đổi màu theo 'theme' nên không cần chỉnh tay nữa
  };

  return (
    <div className="dashboard__chart-wrapper">
      <h3 className="dashboard__chart-wrapper-title">
        Tỉ lệ Tour theo danh mục
      </h3>
      {data.length > 0 ? (
        <Pie {...config} height={300} />
      ) : (
        <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Chưa có dữ liệu
        </div>
      )}
    </div>
  );
}

export default TourCategoryChart;
