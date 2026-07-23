import { createSlice } from "@reduxjs/toolkit";

let savedLanguage = localStorage.getItem("app_language");
if (!savedLanguage) {
  savedLanguage = "en";
  localStorage.setItem("app_language", "en");
}

const initialState = {
  currentLanguage: savedLanguage,
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem("app_language", action.payload); // Lưu vào localStorage để nhớ lựa chọn
    },
  },
});

export const { changeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
