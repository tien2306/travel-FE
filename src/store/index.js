import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice"; // Có thể đặt tên tùy ý vì nó là export default

const store = configureStore({
  reducer: {
    loginReducer,
  },
});

export default store;
