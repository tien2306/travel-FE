### 1. `image.js`

Cung cấp các hàm xử lý mã hóa file hình ảnh gốc (`getBase64`) và kiểm tra đường dẫn hiển thị xem trước (`handleImagePreview`). Dùng để giải quyết triệt để lỗi thẻ `<Image>` của Ant Design không đọc được file ảnh vừa tải lên từ máy tính do thiếu đường link URL.

**Được sử dụng tại:**
- `CreateTourModal.js`, `CreateCarouselModal.js`: Tại chức năng Upload, sử dụng `handleImagePreview` để bấm vào con mắt xem trước bức ảnh (vừa tải lên hoặc ảnh cũ) mà không bị lỗi trắng xóa.

-------------------------------- Hàm chuyển file vật lý thành chuỗi Base64 --------------------------------
```javascript
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Tạo 1 Promise bao bọc (chờ đọc xong file thì báo resolve, lỗi thì reject)
    const reader = new FileReader(); // Khởi tạo công cụ đọc file có sẵn của trình duyệt

    reader.readAsDataURL(file); 
    // Bắt đầu nhai file gốc (vd: ổ C:\Users\hinh.png) và ép nó thành 1 chuỗi ký tự khổng lồ (chuỗi mã hóa Base64)

    reader.onload = () => resolve(reader.result);
    // Hàm này tự kích hoạt khi đọc thành công -> Trả chuỗi khổng lồ đó ra ngoài qua biến reader.result

    reader.onerror = (error) => reject(error); // Báo lỗi nếu đọc hỏng
  });
};
```

-------------------------------- Hàm quản lý xem trước (Preview) --------------------------------
```javascript
export const handleImagePreview = (file, setPreviewSrc, setPreviewOpen) => {
  // TRƯỜNG HỢP 1: Ảnh CŨ đã tồn tại trên Database
  if (file.url) { // Có sẵn đường link web xịn rồi (http://...)
    setPreviewSrc(file.url); // Móc cái link đó đưa cho popup xem trước
    setPreviewOpen(true);    // Mở popup lên
    return; // Dừng chạy code
  }

  // TRƯỜNG HỢP 2: Ảnh MỚI tinh vừa pick từ máy tính (chưa có url)
  if (!file.preview) { // Lần ĐẦU TIÊN bấm xem trước ảnh mới này
    getBase64(file.originFileObj).then((result) => { 
      // Ép cái file vật lý đó qua hàm getBase64 để dịch thành chuỗi mã hóa
      file.preview = result; // Cất khôn chuỗi mã hóa này vào thuộc tính .preview để dành
      setPreviewSrc(file.preview); // Bơm chuỗi mã hóa vào popup (thẻ Image hiểu cái này y chang URL web)
      setPreviewOpen(true); // Bật popup
    });
  } else { 
    // TRƯỜNG HỢP 3: Lần thứ 2 (thứ n) bấm xem lại cái ảnh đó
    setPreviewSrc(file.preview); // Rút cái chuỗi mã hóa đã cất sẵn ra xài lại, khỏi tốn công dịch lại làm lag web
    setPreviewOpen(true);
  }
};
```
