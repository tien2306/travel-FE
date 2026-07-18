import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      // Cập nhật giao diện và lưu local luôn trong reducer
      document.documentElement.setAttribute("data-theme", state.theme);
      localStorage.setItem("theme", state.theme);
    },
    // Đảm bảo khi ứng dụng khởi chạy lần đầu tiên ăn đúng theme
    initTheme: (state) => {
      document.documentElement.setAttribute("data-theme", state.theme);
    }, // => type:name/checkLogin <=>  type:initTheme/checkLogin | Hàm này là action creators
  },
});

export const { toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
