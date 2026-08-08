### 1. `format.js`

File này chứa 3 hàm Format vô cùng quan trọng và được sử dụng rộng rãi khắp cả ứng dụng:

- **`formatDate(dateString)`**: Biến đổi chuỗi ngày tháng khô khan từ Database thành định dạng thân thiện "Ngày DD tháng MM năm YYYY" (Ví dụ: `15/08/2026`).
- **`formatPrice(price)`**: Thêm dấu phẩy phân cách hàng nghìn và chữ "đ" (Ví dụ: `1,500,000 đ`).
- **`getDuration(startDate, endDate)`**: Tự động tính toán số ngày số đêm dựa vào ngày đi và ngày về (Ví dụ: `5 ngày 4 đêm`).

**Được sử dụng tại:**

- `TourGrid.js`: Format ngày đi.
- `TourList.js`: Format ngày đi.
- `ProductInfo.js`: Format giá tiền và ngày đi.
- `ToursRelated/index.js`: Format giá tiền, ngày đi, tính thời lượng cho Tour liên quan.
- `Favorites/index.js`: Format giá tiền, ngày đi, tính thời lượng trong Danh sách yêu thích.
- `LisTour.js`: Format giá tiền, ngày đi trong Bảng danh sách Tour của Admin.
