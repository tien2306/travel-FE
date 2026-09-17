### 1. `format.js`

File này chứa 3 hàm Format vô cùng quan trọng và được sử dụng rộng rãi khắp cả ứng dụng:

- **`formatDate(dateString)`**: Biến đổi chuỗi ngày tháng khô khan từ Database thành định dạng thân thiện "Ngày DD tháng MM năm YYYY" (Ví dụ: `15/08/2026`).
- **`formatPrice(price)`**: Thêm dấu phẩy phân cách hàng nghìn và chữ "đ" (Ví dụ: `1.500.000 ₫`).
- **`getDuration(startDate, endDate)`**: Tự động tính toán số ngày số đêm dựa vào ngày đi và ngày về (Ví dụ: `5 ngày 4 đêm`).

**Được sử dụng tại:**

- `TourGrid.js`, `TourList.js`: Format ngày đi.
- `ProductInfo.js`: Format giá tiền và ngày đi.
- `ToursRelated/index.js`, `Favorites/index.js`: Format giá tiền, ngày đi, tính thời lượng cho Tour liên quan/yêu thích.
- `LisTour.js`: Format giá tiền, ngày đi trong Bảng danh sách Tour của Admin.

-------------------------------- Hàm format giá tiền --------------------------------

```javascript
export const formatPrice = (price) => {
  if (!price) return "---"; // Bắt lỗi: Nếu không có giá truyền vào -> trả về dấu gạch ngang
  return Number(price).toLocaleString("vi-VN") + " ₫";
  // B1: Ép kiểu price về Số (Number) để phòng hờ bị truyền chuỗi.
  // B2: Dùng hàm toLocaleString("vi-VN") của JavaScript để tự động chèn dấu chấm hàng nghìn chuẩn Việt Nam.
  // B3: Nối thêm chữ " ₫" vào cuối. Trả về kết quả "1.500.000 ₫".
};
```

-------------------------------- Hàm format ngày tháng --------------------------------

```javascript
export const formatDate = (dateStr) => {
  if (!dateStr) return "---"; // Nếu rỗng -> trả về gạch ngang
  const date = new Date(dateStr);
  // Biến chuỗi text (vd: "2026-08-15T00:00:00.000Z") thành Object Date

  const dd = String(date.getDate()).padStart(2, "0");
  // Lấy ra số ngày (vd: mùng 5). Ép sang chữ String -> "5".
  // Dùng padStart(2, "0") để chèn thêm số 0 đằng trước nếu chuỗi chưa đủ 2 ký tự -> "05".

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  // Lấy ra số tháng. Tháng trong JS chạy từ 0 đến 11 nên phải cộng thêm 1. Sau đó nhét số 0 như trên.

  const yyyy = date.getFullYear(); // Lấy năm hiện tại

  return `${dd}/${mm}/${yyyy}`; // Ghép lại thành "05/08/2026"
};
```

-------------------------------- Hàm tính thời gian tour --------------------------------

```javascript
export const getDuration = (start, end) => {
  if (!start || !end) return "Đang cập nhật";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = Math.abs(endDate - startDate);
  // Lấy thời điểm Về trừ đi thời điểm Đi (mili-giây). Dùng Math.abs để ra số dương tuyệt đối.

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // 1 ngày = 1000ms * 60s * 60m * 24h = 86,400,000 mili-giây
  // Đem diffTime chia cho 1 ngày, sau đó làm tròn lên (Math.ceil) để ra tổng số đêm.

  if (diffDays === 0) return "Trong ngày"; // Sáng đi chiều về
  return `${diffDays + 1} ngày ${diffDays} đêm`; // Số ngày = Số đêm + 1
};
```
