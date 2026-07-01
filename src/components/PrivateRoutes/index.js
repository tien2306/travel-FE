import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCookie } from "../../helpers/cookie";
import Error404 from "../../page/Error404";

function getUserRole() {
  const userCookie = getCookie("user");

  if (!userCookie) {
    return "";
  }

  try {
    const user = JSON.parse(userCookie);
    const roleName = user?.role?.name || user?.roleName || user?.role || "";

    return String(roleName).toUpperCase();
  } catch (error) {
    return "";
  }
}

function PrivateRoutes({ allowedRoles = [] }) {
  const location = useLocation();
  const isLogin = useSelector((state) => state.loginReducer);
  const token = getCookie("accessToken");
  const isAuthenticated = isLogin || Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).toUpperCase(),
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      return <Error404 />;
    }
  }

  return <Outlet />;
}

export default PrivateRoutes;
