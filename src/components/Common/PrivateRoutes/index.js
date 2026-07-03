import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoutes(props) {
  const state = useSelector((state) => state.loginReducer);
  const { isLogin, role } = state;
  const { allowedRoles } = props;
  // console.log(allowedRoles) // ['ADMIN','USER']

  // 1. KT đăng nhập
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đăng nhập rồi, KT quyền role
  if (allowedRoles && !allowedRoles.includes(role)) {
    //include: xem một giá trị có nằm trong mảng hay không
    // KT trong mảng allowedRoles ['ADMIN','USER']
    // Có chứa giá trị role từ reducer ko? vd: role: "ADMIN" -> trong mảng có chứa
    return <Navigate to="/" replace />;
  }

  // 3. Thông qua 2 KT trên
  return <Outlet />;
}

export default PrivateRoutes;
