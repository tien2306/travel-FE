import { useEffect, useState, useCallback } from "react";
import { Table, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToursAdmin, updateTourStatus } from "../../../services/tour";
import EditTour from "./EditTour";
import DeleteTour from "./DeleteTour";
import CreateTourModal from "../../../components/Admin/CreateTourModal/CreateTourModal";

import "./ListTour.scss";
import { formatDate, formatPrice } from "../../../helpers/fomatDate";

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
      const res = await getToursAdmin(page);
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
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Lỗi khi tải danh sách tour!",
        timer: 1500,
        showConfirmButton: false,
      });
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

  // 6. Xử lý cập nhật trạng thái tour
  const handleStatusChange = async (newStatus, record) => {
    // console.log(newStatus, record);
    try {
      const res = await updateTourStatus(record.key, { status: newStatus });
      if (res && res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Cập nhật trạng thái thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        setData((prevData) =>
          prevData.map((item) =>
            item.key === record.key ? { ...item, status: newStatus } : item,
          ),
        );
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Cập nhật trạng thái thất bại!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Lỗi hệ thống khi cập nhật trạng thái!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // dataIndex tìm dữ liệu
  // vd  dataIndex: "subtitle",
  // thì cái   render: (text) => text || "---",
  // console.log(text) // một string
  // Nếu  dataIndex: "isActive",
  // thì cái render: (isActive, record) => (...)
  // console.log(isActive) // là một boolean

  // oncell: ở màn nhỏ thay vì chỉ hiện giá trị dataIndex: "subtitle",
  // thì nó sẽ hiển thị | Tiêu đề phụ:  giá trị của subtitle

  // 7. Toàn bộ cột bảng
  const columns = [
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
      width: 150,
      onCell: () => ({ "data-label": "Giá:" }),
      render: (price) => (
        <span className="tour-price">{formatPrice(price)}</span>
      ),
    },
    // --- Các cột ẩn dưới 1150px ---
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
      onCell: () => ({ "data-label": "Khởi hành:" }),
      render: (date) => formatDate(date),
    },
    // --- Luôn hiển thị ---
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center",
      onCell: () => ({ "data-label": "Trạng thái:" }),
      render: (status, record) => (
        <Select
          value={status || "ACTIVE"}
          onChange={(newStatus) => handleStatusChange(newStatus, record)}
          options={[
            { value: "ACTIVE", label: "ACTIVE" },
            { value: "INACTIVE", label: "INACTIVE" },
            { value: "CLOSED", label: "CLOSED" },
          ]}
          style={{ width: 120 }}
          className="tour-status-select"
        />
      ),
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
        <div
          className="list-tour-header__actions"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Input
            size="large"
            placeholder="Tìm kiếm tour..."
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            style={{ width: "250px", borderRadius: "8px" }}
          />
          <CreateTourModal onReload={handleReload} />
        </div>
      </div>

      {/* Bảng danh sách Tour */}
      <Table
        className="tour-table"
        dataSource={data}
        columns={columns}
        loading={loading}
        scroll={{ x: 1000 }}
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
