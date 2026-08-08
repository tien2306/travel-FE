
### 1. `cookie.js`
Cung cấp các hàm tương tác với Cookie của trình duyệt (`getCookie`, `setCookie`, `deleteCookie`, `deleteAllCookies`).

**Được sử dụng tại:**
- `App.js`: Đọc token từ cookie (`getCookie`) để khởi tạo thông tin đăng nhập khi user mới mở trang web.
- `Login/index.js`: Lưu token vào cookie (`setCookie`) sau khi người dùng đăng nhập thành công.
- `loginSlice.js`: Quản lý state đăng nhập của Redux (tự động đọc/ghi token khi store khởi tạo hoặc thay đổi).
- `request.js`: Lấy token từ cookie (`getCookie`) để tự động gắn vào Header (Authorization) của mọi API request.


