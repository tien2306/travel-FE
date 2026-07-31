import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/loginSlice";
import { Spin } from "antd";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Dispatch action logout để dọn sạch thông tin trong Redux và xóa Cookie
    dispatch(logout());

    // 2. Chuyển hướng về trang chủ
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="large" tip="Đang xử lý đăng xuất..." />
    </div>
  );
}

export default Logout;
