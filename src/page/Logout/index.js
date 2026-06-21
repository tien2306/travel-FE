import { useNavigate } from "react-router-dom";
import { setCookie } from "../../helpers/cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setCookie("accessToken", "", -1);
    setCookie("user", "", -1);

    dispatch(checkLogin(false));
    navigate("/");
  }, [dispatch, navigate]);

  return null;
}

export default Logout;
