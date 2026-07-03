// import { useEffect } from "react";
// import "./App.css";

// import { checkLogin } from "./actions/login";
// import { getCookie } from "./helpers/cookie";
// import { useDispatch } from "react-redux";
import AllRoutes from "./components/Common/Allroute";

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // Khi người dùng F5 hoặc vừa vào trang web
  //   const token = getCookie("accessToken");
  //   const storedUser = getCookie("user") ? JSON.parse(getCookie("user")) : null;

  //   if (token && storedUser) {
  //     // Đọc thông tin role từ cookie user lên store khi F5
  //     const userRole = storedUser.role.name || null;
  //     dispatch(checkLogin(true, userRole));
  //   } else {
  //     dispatch(checkLogin(false, null));
  //   }
  // }, [dispatch]);

  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
