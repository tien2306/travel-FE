import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../../helpers/cookie";

const token = getCookie("accessToken");
const storedUser = getCookie("user") ? JSON.parse(getCookie("user")) : null;
const userRole = storedUser?.role?.name || null;

const initialState = {
  isLogin: token && storedUser ? true : false,
  role: userRole,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    checkLogin: (state, action) => {
      // payload structure: { status: boolean, role: string | null }
      state.isLogin = action.payload.status;
      state.role = action.payload.role;
    },
  },
});

export const { checkLogin } = loginSlice.actions;
export default loginSlice.reducer;
