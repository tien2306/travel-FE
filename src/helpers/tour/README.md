### 1. `tourForm.js`

Cung cấp hàm `buildTourPayload()`. Vì form tạo/sửa Tour có rất nhiều trường phức tạp (lịch trình, mảng giá tiền, danh sách ảnh...), hàm này chịu trách nhiệm thu thập, nhào nặn và biến đổi dữ liệu thô từ UI form thành một Object chuẩn định dạng (Payload) để gửi lên API Backend.

**Được sử dụng tại:**

- `CreateTourModal.js`: Chuẩn bị data trước khi gọi API POST tạo Tour.
- `EditTour.js`: Chuẩn bị data trước khi gọi API PUT cập nhật Tour.
