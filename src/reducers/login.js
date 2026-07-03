import { getCookie } from "../helpers/cookie";

// 1. Đọc trực tiếp cookie ngay tại đây, việc này chạy tức thời khi web vừa nạp code
const token = getCookie("accessToken");
const storedUser = getCookie("user") ? JSON.parse(getCookie("user")) : null;
const userRole = storedUser?.role?.name || null;

// 2. Gán giá trị thực tế vào initialState luôn
const initialState = {
  isLogin: token && storedUser ? true : false,
  role: userRole,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_LOGIN": // Hoặc tên action type bạn đang đặt cho hàm checkLogin
      return {
        ...state,
        isLogin: action.status, // Giữ nguyên logic action cũ của bạn
        role: action.role,
      };
    default:
      return state;
  }
};
