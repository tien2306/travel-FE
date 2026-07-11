import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setCookie } from "../../../helpers/cookie";
import { checkLogin } from "../../../store/slices/loginSlice";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Xóa cookie trên toàn hệ thống bằng cách ghi đè chuỗi rỗng và ngày hết hạn âm
    setCookie("accessToken", "", -1);
    setCookie("user", "", -1);

    // Xóa trạng thái đăng nhập và quyền hạn trên Redux Store
    dispatch(checkLogin({ status: false, role: null }));

    // Đẩy người dùng về trang chủ
    navigate("/");
  }, [dispatch, navigate]);

  return null;
}

export default Logout;
