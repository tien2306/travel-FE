import { useEffect, useState, useCallback, useRef } from "react";
import { Table, Select, Input } from "antd";

import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUsers, updateUser } from "../../../services/user";
import EditUser from "./EditUser";
import CreateUserModal from "./CreateUserModal";
import DeleteUser from "./DeleteUser";
import "./ListUser.scss";

function ListUser() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const [searchText, setSearchText] = useState(keyword);
  const searchTimeoutRef = useRef(null);

  const currentPage = parseInt(searchParams.get("page")) || 1;

  const fetchApi = useCallback(
    async (page, search = "") => {
      setLoading(true);
      try {
        const res = await getUsers(page, pageSize, search);

        if (res && res.success) {
          const rawData = Array.isArray(res.data)
            ? res.data
            : res.data?.items || [];

          const formattedData = rawData.map((item) => ({
            ...item,
            key: item._id || item.id,
          }));
          setData(formattedData);

          if (res.data && res.data.pagination) {
            setTotalItems(res.data.pagination.total);
            setPageSize(res.data.pagination.limit);
          } else {
            setTotalItems(formattedData.length);
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Lỗi khi tải danh sách user!",
          timer: 1500,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    fetchApi(currentPage, keyword);
  }, [currentPage, fetchApi, keyword]);

  const handleReload = () => {
    fetchApi(currentPage, keyword);
  };

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

  const handleRoleChange = async (newRoleId, record) => {
    try {
      const res = await updateUser(record.key, { roleId: newRoleId });
      if (res && res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Cập nhật quyền thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        setData((prevData) =>
          prevData.map((item) =>
            item.key === record.key
              ? {
                  ...item,
                  roleId: newRoleId,
                  role: {
                    ...item.role,
                    id: newRoleId,
                    name: newRoleId === 1 ? "ADMIN" : "USER",
                  },
                }
              : item,
          ),
        );
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: res?.message || "Cập nhật quyền thất bại!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Lỗi hệ thống khi cập nhật quyền!",
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
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      onCell: () => ({ "data-label": "Họ và tên:" }),
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      onCell: () => ({ "data-label": "Email:" }),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      onCell: () => ({ "data-label": "Số điện thoại:" }),
      render: (text) => text || "---",
    },
    {
      title: "Phân quyền",
      dataIndex: "roleId",
      key: "roleId",
      width: 130,
      align: "center",
      onCell: () => ({ "data-label": "Phân quyền:" }),
      render: (roleId, record) => {
        const currentRoleId = roleId || record.role?.id || 2;
        return (
          <Select
            value={currentRoleId}
            onChange={(newRoleId) => handleRoleChange(newRoleId, record)}
            options={[
              { value: 2, label: "USER" },
              { value: 1, label: "ADMIN" },
            ]}
            style={{ width: 100 }}
          />
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 110,
      align: "center",
      render: (_, record) => (
        <div className="user-list__table-actions">
          <EditUser record={record} onReload={handleReload} />
          <DeleteUser record={record} onReload={handleReload} />
        </div>
      ),
    },
  ];

  return (
    <div className="user-list">
      <div className="user-list__header">
        <div className="user-list__info">
          <h2 className="user-list__title">Quản lý User</h2>
          <p className="user-list__sub">
            Danh sách, thêm mới và chỉnh sửa người dùng.
          </p>
        </div>
        <div className="user-list__actions">
          <Input.Search
            placeholder="Tìm kiếm theo tên, email..."
            style={{ width: "250px", borderRadius: "8px" }}
            onChange={handleSearchChange}
            value={searchText}
            allowClear
          />
          <CreateUserModal onReload={handleReload} />
        </div>
      </div>

      <Table
        className="user-list__table"
        dataSource={data}
        columns={columns}
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
        }}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default ListUser;
