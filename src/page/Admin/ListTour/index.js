import { useEffect, useState, useCallback } from "react";
import { Table, Tag, Image, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTours } from "../../../services/tour";

import EditTour from "../../../components/Admin/ListTour/EditTour";
import DeleteTour from "../../../components/Admin/ListTour/DeleteTour";
import CreateTourModal from "../../../components/Admin/ListTour/CreateTourModal";

import bg from "../../../images/carousel-1.jpg";

import "./ListTour.scss";
import { IMAGE_URLS } from "../../../constants/api";

// Hàm format giá tiền sang dạng "1.000.000 ₫"
const formatPrice = (price) => {
  if (!price) return "---";
  return Number(price).toLocaleString("vi-VN") + " ₫";
};

// Hàm format ngày sang "dd/mm/yyyy"
const formatDate = (dateStr) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

function ListTour() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Đọc số trang hiện tại từ URL
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // 2. Hàm gọi API lấy danh sách tour
  const fetchApi = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await getTours(page);
      if (res && res.success) {
        const formattedData = res.data.items.map((item) => ({
          ...item,
          key: item.id,
        }));
        setData(formattedData);

        setTotalItems(res.data.pagination.total);
        setPageSize(res.data.pagination.limit);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách tour!");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Lắng nghe URL: mỗi khi page thay đổi thì reload dữ liệu
  useEffect(() => {
    fetchApi(currentPage);
  }, [currentPage, fetchApi]);

  // 4. Hàm reload cho Edit và Delete
  const handleReload = () => {
    fetchApi(currentPage);
  };

  // 5. Xử lý chuyển trang Antd Table
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.current.toString());
    navigate(`?${newParams.toString()}`);
  };

  // 6. Cấu hình cột bảng
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 120,
      render: (imageText) => {
        let src = ``;
        if (!imageText) {
          src = bg;
        } else {
          src = `${IMAGE_URLS.TOURS}${imageText?.trim()}`;
        }
        return (
          <Image
            src={src}
            alt="Tour"
            className="tour-thumbnail"
            placeholder={true}
          />
        );
      },
    },
    {
      title: "Tên Tour",
      dataIndex: "name",
      key: "name",
      width: 200,
      onCell: () => ({ "data-label": "Tên Tour:" }),
      ellipsis: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 140,
      onCell: () => ({ "data-label": "Giá:" }),
      render: (price) => (
        <span className="tour-price">{formatPrice(price)}</span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
      align: "center",
      onCell: () => ({ "data-label": "Số lượng:" }),
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      width: 80,
      align: "center",
      onCell: () => ({ "data-label": "Đã bán:" }),
      render: (sold) => sold || 0,
    },
    {
      title: "Ngày khởi hành",
      dataIndex: "startDate",
      key: "startDate",
      width: 130,
      responsive: ["lg"],
      onCell: () => ({ "data-label": "Khởi hành:" }),
      render: (date) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      onCell: () => ({ "data-label": "Trạng thái:" }),
      render: (status) => {
        const color = status === "ACTIVE" ? "green" : "red";
        const label =
          status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 110,
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <EditTour record={record} onReload={handleReload} />
          <DeleteTour record={record} onReload={handleReload} />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header: Tiêu đề + Nút tạo tour */}
      <div className="list-tour-header">
        <div className="list-tour-header__info">
          <h2 className="list-title">Quản lý Tour</h2>
          <p className="list-sub">
            Thêm mới, chỉnh sửa hoặc xóa các tour du lịch.
          </p>
        </div>
        <CreateTourModal onReload={handleReload} />
      </div>

      {/* Bảng danh sách Tour */}
      <Table
        className="tour-table"
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
        }}
        onChange={handlePageChange}
      />
    </>
  );
}

export default ListTour;
