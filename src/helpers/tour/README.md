### 1. `tourForm.js`

File "trái tim" xử lý logic cho chức năng Tạo Mới và Chỉnh Sửa Tour bên Admin. Cung cấp hàm `buildTourPayload` để gom nhặt toàn bộ dữ liệu (Ngày tháng, Text, File ẢNh) từ Form Ant Design rối ren, kiểm tra xem có File gốc đi kèm không để quyết định đóng gói gửi đi bằng định dạng `FormData` (Gửi Form gồm cả File) hay định dạng `JSON` (Chỉ sửa thông tin Text). Kèm tính năng tự động chuẩn hóa điểm đi.

**Được sử dụng tại:**
- `CreateTourModal.js`, `EditTourModal.js` (Bên trong `Admin/Tour/`): Xử lý toàn bộ data trước khi bấm nút Submit gửi xuống BE API.

-------------------------------- Hàm chuẩn bị Payload Tour --------------------------------
```javascript
export const buildTourPayload = (values) => {
  // 1. Chuẩn hóa tên viết tắt của TP. Hồ Chí Minh
  let normalizedDeparture = values.departurePlace || "";
  const cleanText = normalizedDeparture
    .toLowerCase() 
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Ép về chữ cái Latin, xóa dấu tiếng việt
    .replace(/[^a-z0-9]/g, ""); // Xóa bỏ toàn bộ ký tự đặc biệt, khoảng trắng (vd: Tp,Hcm -> tphcm)

  const hcmKeywords = ["hochiminh", "hcm", "tphcm", "saigon", "sg"];
  if (hcmKeywords.includes(cleanText)) {
    normalizedDeparture = "TP.HCM"; // Dọn dẹp ép về 1 chuẩn duy nhất
  }

  // 2. Định dạng ngày tháng
  const formattedStartDate = values.startDate ? values.startDate.toISOString() : "";
  const formattedEndDate = values.endDate ? values.endDate.toISOString() : "";

  // 3. Phân luồng Ảnh để nhận biết xem user CÓ tải ảnh vật lý mới lên hay không
  // Dựa vào thuộc tính .originFileObj (Chỉ có ảnh từ máy tính mới sinh ra trường này)
  const hasNewThumbnail = values.thumbnail && values.thumbnail.length > 0 && values.thumbnail[0]?.originFileObj;
  const hasNewImages = values.images && values.images.length > 0 && values.images.some((file) => file.originFileObj);

  // 4. Quyết định định dạng đóng gói gửi đi
  if (hasNewThumbnail || hasNewImages) {
    // LUỒNG A: KHI CÓ ẢNH VẬT LÝ MỚI LÊN
    // Bắt buộc phải dùng túi FormData() thì Server mới nhận được File Vật Lý 
    const formData = new FormData();

    // Nhét tất cả giá trị text vào túi
    formData.append("name", values.name);
    // ... nhét các trường còn lại
    formData.append("departurePlace", normalizedDeparture);

    // Xử lý ảnh bìa (1 tấm): Đưa file vật lý vào túi
    if (values.thumbnail && values.thumbnail.length > 0) {
      if (values.thumbnail[0].originFileObj) formData.append("thumbnail", values.thumbnail[0].originFileObj);
      else if (values.thumbnail[0].name) formData.append("thumbnail", values.thumbnail[0].name); 
    }

    // Xử lý bộ ảnh (nhiều tấm)
    if (values.images && values.images.length > 0) {
      // Tách ra ảnh cũ (không có originFileObj) -> Lấy cái link URL nhét vào túi
      const oldImages = values.images.filter((f) => !f.originFileObj).map((f) => f.name);
      oldImages.forEach((url) => formData.append("images", url));

      // Tách ra ảnh mới (có originFileObj) -> Lấy File vật lý nhét vào túi
      const newImageFiles = values.images.filter((f) => f.originFileObj).map((f) => f.originFileObj);
      newImageFiles.forEach((file) => formData.append("images", file));
    }

    // Trả về túi cho BE, đính kèm nhãn mác báo hiệu "Tao là hàng FormData!"
    return { isFormData: true, payload: formData };
  } else {
    // LUỒNG B: CHỈ CHỈNH SỬA TEXT THÔNG THƯỜNG KHÔNG CÓ THAY FILE MỚI
    // Đóng thùng hàng JSON gửi đi nhẹ nhàng nhanh gọn
    const payload = {
      name: values.name,
      // ...các trường khác
      departurePlace: normalizedDeparture,
    };

    // Ảnh bìa cũ là chuỗi URL
    if (values.thumbnail && values.thumbnail.length > 0) {
      payload.thumbnail = values.thumbnail[0].url || values.thumbnail[0].name;
    }

    // Bộ ảnh cũ là 1 list các chuỗi URL
    if (values.images && values.images.length > 0) {
      payload.images = values.images.map((f) => f.url || f.name);
    }

    // Trả về thùng carton mềm mỏng, nhãn mác "Tao là JSON!"
    return { isFormData: false, payload };
  }
};
```
