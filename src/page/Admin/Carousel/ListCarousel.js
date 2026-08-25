import { useEffect, useState, useCallback, useRef } from "react";
import { Table, Switch, Image, Input } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCarousel, updateCarouselStatus } from "../../../services/carousel";
import Swal from "sweetalert2";
import EditCarousel from "./EditCarousel";
import DeleteCarousel from "./DeleteCarousel";
import { IMAGE_URLS } from "../../../constants/api";

import "./ListCarousel.scss";
import CreateCarouselModal from "../../../components/Admin/Carousel/CreateCarouselModal";

function ListCarousel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalItems, setTotalItems] = useState(0); // Tổng số ảnh
  const [pageSize, setPageSize] = useState(10); // Tổng giới hạn số ảnh

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const [searchText, setSearchText] = useState(keyword);
  const searchTimeoutRef = useRef(null);

  // 1. Đọc trực tiếp số trang hiện tại từ thanh URL trình duyệt
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // 2. Giữ nguyên function giữa các lần render.
  const fetchApi = useCallback(async (page, search = "") => {
    setLoading(true);
    try {
      const res = await getCarousel(page, search);
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
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Lỗi khi tải danh sách banner!",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Lắng nghe URL: Cứ hễ số trang hoặc keyword trên thanh URL thay đổi là tự reload dữ liệu mới
  useEffect(() => {
    fetchApi(currentPage, keyword);
  }, [currentPage, fetchApi, keyword]);

  // 4. Hàm load lại trang cho Edit và Delete
  const handleReload = () => {
    fetchApi(currentPage, keyword);
  };

  // 5. Xử lý khi người dùng bấm chuyển trang trên Antd Table
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.current.toString());
    navigate(`?${newParams.toString()}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      if (value) {
        newParams.set("keyword", value);
      } else {
        newParams.delete("keyword");
      }
      navigate(`?${newParams.toString()}`);
    }, 500);
  };

  //6. Xử lý trạng thái hiện ảnh
  const handleStatusChange = async (checked, record) => {
    try {
      const res = await updateCarouselStatus(record.key, { isActive: checked });
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
            item.key === record.key ? { ...item, isActive: checked } : item,
          ),
        );
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

  // oncell: có tác dụng khi co màn thành dth nó sẽ ẩn cột title vì v oncell sẽ gán 1 thuộc tính data-label= "..."
  // nhiệm vụ mình là scss lại nó để hiển thị

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
            className="carousel-table__thumbnail"
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
        <div className="carousel-table__actions">
          <EditCarousel record={record} onReload={handleReload} />
          <DeleteCarousel record={record} onReload={handleReload} />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="list-carousel-header">
        <div className="list-carousel-header__info">
          <h2 className="list-carousel-header__title">Danh sách banner</h2>
          <p className="list-carousel-header__sub">
            Quản lý trạng thái hiển thị, chỉnh sửa hoặc gỡ bỏ các banner quảng
            cáo.
          </p>
        </div>
        <div
          className="list-carousel-header__actions"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề..."
            style={{ width: "250px", borderRadius: "8px" }}
            onChange={handleSearchChange}
            value={searchText}
            allowClear
          />
          <CreateCarouselModal onReload={handleReload} />
        </div>
      </div>

      <Table
        className="carousel-table"
        dataSource={data}
        columns={columns}
        loading={loading}
        scroll={{ x: 1000 }}
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
