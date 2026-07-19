import { useEffect, useState, useCallback } from "react";
import { Table, Switch, Image, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToursAdmin, updateTourStatus } from "../../../services/tour";
import bg from "../../../images/carousel-1.jpg";

import EditTour from "./EditTour";
import DeleteTour from "./DeleteTour";
import CreateTourModal from "../../../components/Admin/CreateTourModal/CreateTourModal";

import "./ListTour.scss";
import { IMAGE_URLS } from "../../../constants/api";
import { formatDate, formatPrice } from "../../../helpers/fomatDate";

// Hook lấy chiều rộng cửa sổ và cập nhật khi resize
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function ListTour() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lấy chiều rộng màn hình để điều chỉnh cột
  const windowWidth = useWindowWidth();
  const isSmallScreen = windowWidth <= 1150;
  const isTablet = windowWidth <= 768;

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

  // 6. Xử lý bật/tắt trạng thái tour bằng Switch
  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? "ACTIVE" : "INACTIVE";
    try {
      const res = await updateTourStatus(record.key, { status: newStatus });
      if (res && res.success) {
        message.success("Cập nhật trạng thái thành công!");
        setData((prevData) =>
          prevData.map((item) =>
            item.key === record.key ? { ...item, status: newStatus } : item,
          ),
        );
      } else {
        message.error("Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      message.error("Lỗi hệ thống khi cập nhật trạng thái!");
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
  const allColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 120,
      render: (imageText) => {
        const src = !imageText ? bg : `${IMAGE_URLS.TOURS}${imageText?.trim()}`;
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
      width: isSmallScreen ? 180 : 200,
      onCell: () => ({ "data-label": "Tên Tour:" }),
      ellipsis: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: isSmallScreen ? 130 : 150,
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
      hideBelow: 1150,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      width: 80,
      align: "center",
      onCell: () => ({ "data-label": "Đã bán:" }),
      render: (sold) => sold || 0,
      hideBelow: 1150,
    },
    {
      title: "Ngày khởi hành",
      dataIndex: "startDate",
      key: "startDate",
      width: 130,
      onCell: () => ({ "data-label": "Khởi hành:" }),
      render: (date) => formatDate(date),
      hideBelow: 1150,
    },
    // --- Luôn hiển thị ---
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      onCell: () => ({ "data-label": "Trạng thái:" }),
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          checkedChildren="Active"
          unCheckedChildren="InActive"
          onChange={(checked) => handleStatusChange(checked, record)}
          className="tour-status-switch"
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

  // 8. Lọc cột theo kích thước màn hình
  const columns = allColumns.filter(
    (col) => !col.hideBelow || windowWidth > col.hideBelow,
  );

  // 9. Tính scroll x dựa theo số cột còn lại
  const tableScrollX = isTablet ? undefined : isSmallScreen ? 700 : 1000;

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
        scroll={{ x: tableScrollX }}
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
