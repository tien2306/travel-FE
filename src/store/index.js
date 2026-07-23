import { configureStore } from "@reduxjs/toolkit";

// Có thể đặt tên tùy ý vì nó là export default
import loginReducer from "./slices/loginSlice";
import themeReducer from "./slices/themeSlice";
import languageReducer from "./slices/languageSlice";

const store = configureStore({
  reducer: {
    loginReducer,
    themeReducer,
    languageReducer,
  },
});

export default store;
