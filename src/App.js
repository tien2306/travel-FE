import { useEffect } from "react";
import "./App.css";
import AllRoutes from "./components/Allroute";
import { checkLogin } from "./actions/login";
import { getCookie } from "./helpers/cookie";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Khi người dùng F5 hoặc vừa vào trang web
    const token = getCookie("accessToken");
    if (token) {
      dispatch(checkLogin(true));
    } else {
      dispatch(checkLogin(false));
    }
  }, [dispatch]);

  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
