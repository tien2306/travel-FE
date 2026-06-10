import { Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
import Error404 from "../../page/Error404";

function PrivateRoutes() {
  // const state = useSelector((state) => state.loginReducer);
  const isLogin = true;
  return <>{isLogin ? <Outlet /> : <Error404 />}</>;
}

export default PrivateRoutes;
