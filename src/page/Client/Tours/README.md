# 🗺️ HƯỚNG DẪN ĐỌC CODE: TÍNH NĂNG TOURS (Client)

Chào mừng bạn đến với vùng đất "Tours"! Vì tính năng này khá lớn và được chia nhỏ theo chuẩn Component-Based để dễ bảo trì, nên đôi khi bạn sẽ bị "lạc đường" khi click từ file này sang file khác. 

Đừng lo, hãy xem file này là **Bản đồ chỉ đường** nhé.

---

## 1. CÁC FILE CHÍNH Ở ĐÂY (`src/page/Client/Tours/`)

Đây là thư mục chứa các **Trang (Pages)** - tức là những file trực tiếp được gắn vào React Router để tạo ra các đường link (URL).

*   📄 **`ToursAll.js`**: Trang danh sách toàn bộ Tour (Kèm chức năng Lọc và Tìm kiếm). Đây là trang tổng chỉ huy, nó gọi các component con ở nơi khác về để lắp ráp thành 1 trang hoàn chỉnh.
*   📄 **`ToursDetail.js`**: Trang xem Chi tiết của 1 Tour cụ thể (Lịch trình, Giá vé, Bình luận...).
*   📄 **`ToursRelated.js`**: Trang hiển thị danh sách các Tour tương tự (Tour có liên quan).
*   📄 **`animations.js`**: Chứa các hiệu ứng cuộn, mờ dần, trượt lên... được tách riêng ra đây cho sạch code.

---

## 2. CÁC COMPONENT CON (`src/components/Client/ToursAll/`)

Khi bạn vào trang `ToursAll.js`, bạn sẽ thấy nó import cả đống file. Toàn bộ những file đó nằm ở thư mục `components/Client/ToursAll/`. Chỗ này đã được chia thành 4 khu riêng biệt:

### 🎯 Khu vực A: `Filters/` (Bộ Lọc Bên Trái)
Nơi chứa toàn bộ code của cái cột Lọc Tour (Sidebar Filter).
*   `SidebarFilter.js`: File gốc tổng hợp các bộ lọc.
*   `FilterSections/`: Thư mục con chứa từng cục lọc nhỏ:
    *   `BudgetFilter.js` (Lọc theo Giá)
    *   `CategoryFilter.js` (Lọc theo Dòng Tour: Cao cấp, Tiết kiệm...)
    *   `DepartureFilter.js` (Lọc theo Điểm đi)
    *   `TransportFilter.js` (Lọc theo Xe/Máy bay)

### 🎯 Khu vực B: `Search/` (Thanh Tìm Kiếm Trên Cùng)
*   `HeaderSearch.js`: Thanh dài dài nằm ngang chứa ô nhập Điểm đi, Điểm đến, và Ngày tháng.

### 🎯 Khu vực C: `Results/` (Khối Kết Quả Bên Phải)
Nơi hứng dữ liệu từ API về và in ra các tấm thẻ (Card).
*   `TourListResults.js`: File gốc tổng hợp danh sách kết quả.
*   `TourResultsToolbar.js`: Cái thanh ngang có chữ "Đã tìm thấy X tour" và nút Sắp xếp giá.
*   `TourGrid.js`: Lưới hiển thị các tour dạng Thẻ dọc.
*   `TourList.js`: Danh sách hiển thị các tour dạng Thẻ ngang (List).
*   `TourCard.scss`: File CSS định dạng cho tấm thẻ Tour.
*   `TourPagination.js`: Phân trang (1, 2, 3...).

### 🎯 Khu vực D: `Mobile/` (Giao Diện Điện Thoại)
Màn hình máy tính thì đủ chỗ, nhưng điện thoại thì không. 2 file này sinh ra để phục vụ riêng cho điện thoại:
*   `MobileFilterBar.js`: Cục Nút tròn lơ lửng ở góc phải dưới màn hình (khi ấn vào hiện chữ Lọc/Tìm kiếm).
*   `MobileDrawers.js`: Hai cái bảng đen thui trượt từ cạnh trái/phải màn hình ra khi bạn bấm nút trên điện thoại.

---

## 💡 BÍ KÍP FIX BUG NHANH:
- Thấy giao diện thẻ Tour bị lỗi màu, chữ méo? 👉 Chui vào `Results/` (Xem TourGrid hoặc TourList).
- Thanh lọc giá kéo không ăn? 👉 Chui vào `Filters/FilterSections/BudgetFilter.js`.
- Bấm trên điện thoại mà nó không trượt ra cái bảng? 👉 Chui vào `Mobile/MobileDrawers.js`.
- Tìm lỗi liên quan đến đường dẫn URL hoặc dữ liệu API tổng? 👉 Ở yên tại `ToursAll.js`.
