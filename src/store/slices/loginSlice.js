// Note
// các hàm bên trong reducers -> phải là một hàm thuần túy
// Nghĩa là đưa đầu vào giống nhau thì đầu ra phải giống nhau ngay lập tức, không được phép chờ đợi.
// ui -> dispatch action -> reducer -> store -> ui
// Nếu đưa async/await vào trong reducers, hàm này sẽ trả về một Promise thay vì thay đổi dữ liệu ngay.

// Vì vậy sinh ra createAsyncThunk, extraReducers
// createAsyncThunk đây là một action đặc biệt, Tại sao lại đặc biệt ?
// Vì action Creator thông thường sẽ chả về một object có dạng { type: "...", payload: "..." }
// còn hàm này sẽ trả về một function
// Và nó nằm ngoài Slice, là nơi duy nhất được phép viết async/await, gọi API, đợi mạng phản hồi.
// Nó ko thể sử dữ liệu từ initialState

// Nên nó cần extraReducers
// Tại sao lại gọi là "EXTRA" ? Vì
// reducers thông thường: Là do cái Slice này tự sinh ra (Ví dụ: Hành động logout là của riêng cái Slice này, tự tạo tự xử lý)
// extraReducers: Là để xử lý các hành động từ bên ngoài (External Actions)
// dùng để "hóng" xem thằng bên ngoài làm ăn ra sao rồi ké theo để cập nhật dữ liệu của mình

// createAsyncThunk
// chả về hàm có 2 tham số (vd:id,ThunkAPI)
// tham số 1 là data truyền vào action,
// tham số 2 là một object chứa các công cụ của redux
// thunkAPI.rejectWithValue: Dùng để chủ động trả về một giá trị lỗi tùy biến khi API thất bại.
// thunkAPI.getState : Giúp đọc được toàn bộ dữ liệu hiện tại đang có trong Redux Store
// thunkAPI.dispatch: Giúp bạn kích hoạt một action khác ngay bên trong hàm thunk này.
// signal: Dùng để hủy lệnh gọi API (Cancel Request) nếu người dùng đổi ý hoặc chuyển trang đột ngột khi API chưa kịp chạy xong.

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "../../helpers/auth/cookie";
import { getAuthMe } from "../../services/user";

const token = getCookie("accessToken");

const initialState = {
  isLogin: token ? true : false,
  role: null,
  user: null,
  loading: token ? true : false,
};

export const fetchUserSession = createAsyncThunk(
  "login/fetchUserSession",
  //
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAuthMe();
      if (response && response.success) {
        return response.data;
      } else {
        return rejectWithValue({
          isNetworkError: false,
          message: response.message || "Failed to fetch user",
        });
      }
    } catch (error) {
      return rejectWithValue({ isNetworkError: true, message: error.message });
    }
  },
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    checkLogin: (state, action) => {
      // payload structure: { status: boolean, role: string | null, user: object | null }
      state.isLogin = action.payload.status;
      state.role = action.payload.role;
      state.user = action.payload.user || null;
    }, // => type:name/checkLogin <=>  type:login/checkLogin | Hàm này là action creators
    logout: (state) => {
      state.isLogin = false;
      state.role = null;
      state.user = null;
      setCookie("accessToken", "", -1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isLogin = true;
        state.user = action.payload;
        state.role = action.payload.role?.name || null;
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.loading = false;

        // Chỉ xóa token và bắt đăng nhập lại nếu đó KHÔNG phải là lỗi mạng/abort
        if (!action.payload?.isNetworkError) {
          state.isLogin = false;
          state.user = null;
          state.role = null;
          setCookie("accessToken", "", -1); // Xóa token nếu lỗi/hết hạn
        }
      });
  },
});

export const { checkLogin, logout } = loginSlice.actions;
export default loginSlice.reducer;
