### 1. `avatar.js`

Cung cấp hàm `getAvatarColor(avatarText)` để tự động trả về một mã màu nền (background) và màu chữ (text color) ngẫu nhiên nhưng cố định dựa vào chữ cái đầu tiên của tên người dùng. Giúp Avatar mặc định trông sinh động và đẹp mắt (giống UI của Google).

**Được sử dụng tại:**

- `Profile/index.js`: Hiển thị Avatar lớn ở menu Sidebar của trang cá nhân.
- `Avatar.js`: Hiển thị Avatar trong màn hình chỉnh sửa hồ sơ.
- `Notify/index.js`: Hiển thị Avatar nhỏ xíu ở góc phải trên cùng Header (nút dropdown menu của user).

-------------------------------- Hàm sinh màu Avatar ngẫu nhiên --------------------------------

```javascript
export const getAvatarColor = (text) => {
  // B1: Nếu không truyền chữ gì vào -> Trả về cục màu Xám ảm đạm
  if (!text) return { bg: "#9E9E9E", color: "#fff" };

  // B2: Cắt lấy KÝ TỰ ĐẦU TIÊN của chuỗi, biến thành In Hoa, rồi dịch thành mã ASCII
  // Ví dụ tên "Thanh" -> "T" -> Mã ASCII là 84
  const charCode = text.toUpperCase().charCodeAt(0);

  // Mảng màu Google Material Design gồm 26 màu tương ứng 26 chữ cái Alphabet (A-Z)
  const colors = [{ bg: "#F44336", color: "#fff" } /*... 26 phần tử ...*/];

  // B3: Mapping mã ASCII (65 - 90 là từ A đến Z)
  if (charCode >= 65 && charCode <= 90) {
    // Nếu nó rơi vào chữ cái -> Trừ đi 65 để lấy index (0 đến 25) móc vào mảng
    // Ví dụ: 'T' là 84 -> 84 - 65 = 19 -> Trả về phần tử colors[19]
    return colors[charCode - 65];
  } else {
    // Nếu ký tự đầu là Số (123) hoặc Ký tự lạ, Dấu tiếng Việt (Ă, Ơ, Đ...)
    // Sẽ lấy số mã ASCII đó chia lấy dư cho 26 (% 26). Đảm bảo luôn lấy random 1 màu trong mảng.
    return colors[charCode % 26];
  }
};
```

---

### 2. `avatarUrl.js`

Hàm `getAvatarDisplayUrl()` biến hóa mớ hỗn độn giá trị Avatar (lúc thì rỗng, lúc lại là link, lúc là File cục bộ, lúc lại là Hash của Server) thành một đường link Tuyệt Đối Đẹp Đẽ duy nhất mà thẻ `<img>` nào cũng đọc được. Rất mạnh để diệt gọn các con Bug liên quan đến ảnh Avatar bị móp/trắng.

**Được sử dụng tại:**

- Rải rác ở khắp những Component nào có hiển thị Avatar người dùng (`Profile`, `Header`, `Comments`...).

-------------------------------- Hàm chuẩn hóa đường dẫn Avatar --------------------------------

```javascript
export const getAvatarDisplayUrl = (avatarValue) => {
  // Lọc luồng 1: Nếu rỗng tuếch -> trả về null (lúc này component khác sẽ lôi ảnh mặc định ra thế)
  if (!avatarValue) return null;

  // Lọc luồng 2: Nhận biết File Vật Lý (Từ máy tính vừa ấn tải lên xong)
  // File này là 1 Object và AntD đã hỗ trợ gắn chuỗi base64 vào ".preview"
  if (typeof avatarValue === "object" && avatarValue.preview)
    return avatarValue.preview;

  const cleanUrl = String(avatarValue).trim();
  if (!cleanUrl) return null;

  // Lọc luồng 3: Nếu nó đã là link ngoại xịn rồi (Bắt đầu bằng http, data, /static, blob)
  // Xịn thế thì quăng ra luôn xài thôi, sửa chi nữa!
  if (
    cleanUrl.startsWith("http") ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("/static") ||
    cleanUrl.startsWith("blob:")
  ) {
    return cleanUrl;
  }

  // Lọc luồng 4 (Cuối Cùng): Nếu nó đi lọt xuống đây, có nghĩa nó là cái "Đuôi" file (vd: "AgACAgUAAvk.jpg") do Database trả về.
  // Tiến hành ghép đít nó với cái Tên Miền của Server (IMAGE_URLS.AVATARS)
  return `${IMAGE_URLS.AVATARS}${cleanUrl}`;
};
```

---

### 3. `profileForm.js`

File logic giúp Dọn Dẹp và Đóng Gói (Build Payload) gói hàng dữ liệu cá nhân (Profile) trước khi gọi shipper gửi xuống Backend. Chỉ gửi những gì có thay đổi (tiết kiệm băng thông), tự động nhận biết có đang cập nhật File ảnh không để đóng gói qua kiện hàng `FormData`.

**Được sử dụng tại:**

- `Profile/ProfileInfo.js`: Đứng đằng sau nút Submit của form "Cập nhật Thông tin".

-------------------------------- Hàm đóng gói thông tin Profile --------------------------------

```javascript
export const buildProfilePayload = (values, userInfo) => {
  // Mở ra cái túi Form Data
  const formData = new FormData();

  // Đóng gói TEXT: Đem So sánh các giá trị mà User vừa gõ (values) với giá trị đang tồn tại trong Database (userInfo)
  // CHỈ NÀO CÓ KHÁC BIỆT THÌ MỚI BỎ VÀO TÚI. Nếu giống y chang -> Bỏ qua.
  if (values.fullName !== userInfo?.fullName)
    formData.append("fullName", values.fullName);
  if (values.phone !== userInfo?.phone)
    formData.append("phone", values.phone || "");
  if (values.address !== userInfo?.address)
    formData.append("address", values.address || "");

  // Đóng gói AVATAR: Phân chia 3 trường hợp
  const avatarVal = values.avatar;
  let newAvatarUrl = userInfo?.avatar; // Chuẩn bị sẵn link ảnh cũ dự phòng

  if (avatarVal !== userInfo?.avatar) {
    // Có sự thay đổi về Avatar!
    if (!avatarVal) {
      // Bấm nút xóa ảnh -> Gửi chuỗi rỗng để BE chém bỏ
      formData.append("avatar", "");
      newAvatarUrl = null;
    } else if (typeof avatarVal === "string") {
      // User chán ảnh chụp, chọn lại 1 avatar hoạt hình có sẵn (preset)
      formData.append("avatar", avatarVal);
      newAvatarUrl = avatarVal;
    } else if (avatarVal.file) {
      // User chọn ảnh dưới ổ đĩa C tải lên! Móc cái Object File Thật ra đóng vào túi FormData
      formData.append("avatar", avatarVal.file);
      newAvatarUrl = avatarVal.preview; // preview dùng để BE hoặc mình render nháp
    }
  }

  // Cột nơ cái túi (formData) kèm link ảnh mới gửi về Component gọi nó.
  return { formData, newAvatarUrl };
};
```
