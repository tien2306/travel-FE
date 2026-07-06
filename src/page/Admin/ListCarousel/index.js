import { useEffect, useState, useCallback } from "react";
import { Table, Switch, message, Image } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getCarousel,
  updateCarouselStatus,
} from "../../../services/carouselService";

import EditCarousel from "../../../components/Admin/ListCarousel/EditCarousel";
import DeleteCarousel from "../../../components/Admin/ListCarousel/DeleteCarousel";
import { IMAGE_URLS } from "../../../constants/api";

import "./ListCarousel.scss";

function ListCarousel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalItems, setTotalItems] = useState(0); // Tổng số ảnh
  const [pageSize, setPageSize] = useState(10); // Tổng giới hạn số ảnh

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Đọc trực tiếp số trang hiện tại từ thanh URL trình duyệt
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // 2. Giữ nguyên function giữa các lần render.
  const fetchApi = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await getCarousel(page);
      if (res && res.success) {
        const formattedData = res.data.items.map((item) => ({
          ...item,
          key: item.id || item._id,
        }));
        setData(formattedData);

        setTotalItems(res.data.pagination.total);
        setPageSize(res.data.pagination.limit);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách banner!");
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Lắng nghe URL: Cứ hễ số trang trên thanh URL thay đổi là tự reload dữ liệu mới
  useEffect(() => {
    fetchApi(currentPage);
  }, [currentPage, fetchApi]);

  // 4. Hàm load lại trang cho Edit và Delete
  const handleReload = () => {
    fetchApi(currentPage);
  };

  // 5. Xử lý khi người dùng bấm chuyển trang trên Antd Table
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.current.toString());

    // Đổi hướng URL (Trình duyệt tự hiểu không cần tải lại toàn bộ trang admin)
    navigate(`?${newParams.toString()}`);
  };

  //6. Xử lý trạng thái hiện ảnh
  const handleStatusChange = async (checked, record) => {
    try {
      const res = await updateCarouselStatus(record.key, { isActive: checked });
      if (res && res.success) {
        message.success("Cập nhật trạng thái thành công!");
        setData((prevData) =>
          prevData.map((item) =>
            item.key === record.key ? { ...item, isActive: checked } : item,
          ),
        );
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

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 130,
      render: (imageText) => {
        const src = `${IMAGE_URLS.HERO_CAROUSEL}${imageText?.trim()}`;
        return (
          <Image
            src={src}
            alt="Banner"
            className="banner-thumbnail"
            placeholder={true}
          />
        );
      },
    },
    {
      title: "Tiêu đề phụ",
      dataIndex: "subtitle",
      key: "subtitle",
      width: 150,
      onCell: () => ({ "data-label": "Tiêu đề phụ:" }),
      render: (text) => text || "---",
    },
    {
      title: "Tiêu đề chính",
      dataIndex: "title",
      key: "title",
      width: 180,
      onCell: () => ({ "data-label": "Tiêu đề chính:" }),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      responsive: ["xl"],
      key: "description",
      onCell: () => ({ "data-label": "Mô tả:" }),
      render: (text) => text || "---",
    },
    {
      title: "Thứ tự",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 90,
      align: "center",
      onCell: () => ({ "data-label": "Thứ tự:" }),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      align: "center",
      onCell: () => ({ "data-label": "Trạng thái:" }),
      render: (isActive, record) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={isActive}
          onChange={(checked) => handleStatusChange(checked, record)}
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
          <EditCarousel record={record} onReload={handleReload} />
          <DeleteCarousel record={record} onReload={handleReload} />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="list-carousel-container">
        <h2 className="list-title">Danh sách banner</h2>
        <p className="list-sub">
          Quản lý trạng thái hiển thị, chỉnh sửa hoặc gỡ bỏ các banner quảng
          cáo.
        </p>
      </div>

      <Table
        className="carousel-table"
        dataSource={data}
        columns={columns}
        loading={loading}
        // bordered
        // 7. Cấu hình trực tiếp object pagination cho Antd Table đọc
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

export default ListCarousel;
