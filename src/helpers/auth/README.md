### 1. `cookie.js`

Cung cấp các hàm tương tác trực tiếp với bộ nhớ Cookie của trình duyệt (`getCookie`, `setCookie`, `deleteCookie`, `deleteAllCookies`). Đây là cốt lõi để lưu trữ phiên đăng nhập, giúp người dùng không bị văng ra ngoài mỗi khi tải lại (refresh) trang web.

**Được sử dụng tại:**
- `App.js`: Đọc token từ cookie (`getCookie`) để khởi tạo thông tin đăng nhập khi user mới mở trang web.
- `Login/index.js`: Lưu token vào cookie (`setCookie`) sau khi người dùng đăng nhập thành công.
- `loginSlice.js`: Quản lý state đăng nhập của Redux (tự động đọc/ghi/xóa token khi store khởi tạo hoặc thay đổi).
- `request.js`: Lấy token từ cookie (`getCookie`) để tự động gắn vào Header (Authorization) của mọi API gửi xuống Backend.
- `Logout/index.js`: Xóa token (`deleteAllCookies`) khi người dùng bấm đăng xuất.

-------------------------------- Hàm lấy cookie --------------------------------
```javascript
export function getCookie(name) { 
  // Giả sử gọi hàm: getCookie("theme")
  let nameEQ = name + "="; // Nối thành chuỗi tìm kiếm: "theme="

  let ca = document.cookie.split(";");
  // Lấy toàn bộ rổ cookie ra và chẻ nó thành mảng dựa theo dấu chấm phẩy
  // Ví dụ document.cookie là: "user=John; theme=dark"
  // Mảng 'ca' sinh ra: ["user=John", " theme=dark"] (lưu ý có khoảng trắng ở đầu phần tử thứ 2)

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    // --- VÒNG LẶP LẦN 1 (i = 0): c = "user=John" ---
    // Vòng while: Ký tự đầu không phải khoảng trắng -> Bỏ qua
    // Lệnh if: indexOf("theme=") -> Chuỗi không chứa -> Bỏ qua

    // --- VÒNG LẶP LẦN 2 (i = 1): c = " theme=dark" ---
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    // Có 1 khoảng trắng ở đầu -> Cắt bỏ nó đi -> c trở thành "theme=dark"

    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    // Lúc này c bắt đầu chính xác bằng "theme=" -> Lệnh if đúng!
    // Tiến hành cắt: Từ vị trí dấu "=" (nameEQ.length) đến cuối chuỗi -> Trả về kết quả "dark"
  }
  
  return null; // Quét hết mảng không thấy -> Trả về null
}
```

-------------------------------- Hàm tạo cookie --------------------------------
```javascript
export function setCookie(name, value, days) { 
  // Giả sử gọi hàm: setCookie("theme", "dark", 7)
  let expires = "";

  if (days) { // Tính toán ngày hết hạn nếu có truyền tham số days (vd: 7)
    let date = new Date(); // Lấy ngày giờ hiện tại của máy tính
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    // Tính toán: 7 ngày * 24 giờ * 60 phút * 60 giây * 1000 mili-giây
    // Cộng vào mốc thời gian hiện tại -> Chuyển thành ngày của 1 tuần sau

    expires = "; expires=" + date.toUTCString();
    // Đổi ngày thành chuẩn chuỗi giờ Quốc Tế. Vd: "; expires=Sun, 20 Sep 2026 13:46:00 GMT"
  }

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
  // Ghép nối tất cả nguyên liệu lại rồi ném vào trình duyệt:
  // Trình duyệt lưu: "theme=dark; expires=Sun, 20 Sep 2026 13:46:00 GMT; path=/"
}
```

-------------------------------- Hàm xóa 1 cookie cụ thể --------------------------------
```javascript
export function deleteCookie(name) { 
  // Giả sử gọi hàm: deleteCookie("theme")
  document.cookie = name + "=; Max-Age=-99999999; path=/";
  // Gắn lại cookie đó thành: "theme=; Max-Age=-99999999; path=/"
  
  // Mẹo kinh điển: Set thời gian sống (Max-Age) thành số âm khổng lồ!
  // Trình duyệt đọc thấy số âm sẽ hiểu là "Cái này đã hết hạn từ đời tám hoánh nào rồi" -> Tự động xóa ngay lập tức.
}
```

-------------------------------- Hàm dọn dẹp TOÀN BỘ cookie --------------------------------
```javascript
export function deleteAllCookies() {
  let cookies = document.cookie.split(";");
  // Lấy toàn bộ cookie ra chẻ thành mảng: ["user=John", " theme=dark"]

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];

    // --- VÒNG LẶP LẦN 1: cookie = "user=John" ---
    let eqPos = cookie.indexOf("="); // Tìm ra dấu "=" nằm ở vị trí thứ 4

    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    // Cắt từ đầu đến vị trí số 4 -> name = "user"
    
    name = name.trim(); // "user" 

    document.cookie = name + "=; Max-Age=-99999999; path=/";
    // Nã tên lửa tiêu diệt cookie "user"

    // --- VÒNG LẶP LẦN 2: cookie = " theme=dark" ---
    // ... làm tương tự, name cắt ra được " theme", dùng trim() để gọt khoảng trắng thừa
    // Tiến hành tiêu diệt tiếp cookie "theme"
  }
}
```
