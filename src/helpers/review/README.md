### 1. `image.js`

Cung cấp hàm `handleImagePreview()` dùng để xử lý sự kiện khi người dùng chọn/upload ảnh. Nó sẽ đọc file ảnh và tạo ra một Base64 URL để hiển thị preview ngay lập tức trên UI trước khi lưu.

**Được sử dụng tại:**

- `CreateTourModal.js, CreateCarousel.js`: Xử lý preview ảnh khi Admin thêm Tour mới.
- `EditTour.js, EditCarousel.js`: Xử lý preview ảnh khi Admin thay đổi ảnh của Tour cũ.
