import { useEffect, useState } from "react";
import { Table, Switch, message, Image } from "antd";
import {
  getCarousel,
  updateCarouselStatus,
} from "../../../services/carouselService";

import "./ListCarousel.scss";
import EditCarousel from "../../../components/Admin/ListCarousel/EditCarousel";
import DeleteCarousel from "../../../components/Admin/ListCarousel/DeleteCarousel";

function ListCarousel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchApi = async () => {
    setLoading(true);
    try {
      const res = await getCarousel(page);
      if (res && res.success) {
        const formattedData = res.data.items.map((item) => ({
          ...item,
          key: item.id || item._id,
        }));
        setData(formattedData);

        setPagination({
          current: res.data.pagination.page,
          pageSize: res.data.pagination.limit,
          total: res.data.pagination.total,
        });
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách banner!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleReload = () => {
    fetchApi();
  };

  const handleTableChange = (newPagination) => {
    setPage(newPagination.current);
  };

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

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 130,
      render: (imageText) => {
        const src = `${process.env.REACT_APP_API_URL}hero-carousels/image/${imageText?.trim()}`;
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
      title: "Subtitle",
      dataIndex: "subtitle",
      key: "subtitle",
      width: 150,
      onCell: () => ({ "data-label": "Subtitle:" }),
      render: (text) => text || "---",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 180,
      onCell: () => ({ "data-label": "Title:" }),
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
        bordered
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  );
}

export default ListCarousel;
