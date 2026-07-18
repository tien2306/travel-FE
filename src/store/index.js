import { configureStore } from "@reduxjs/toolkit";

// Có thể đặt tên tùy ý vì nó là export default
import loginReducer from "./slices/loginSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    loginReducer,
    themeReducer,
  },
});

export default store;
