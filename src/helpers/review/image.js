// Image của antd hỗ trợ rất tốt việc hiển thị ảnh NHƯNG đó là một đường link(URL) hợp lệ
// TH bạn chỉnh sửa bấm xem 1 ảnh cũ, vì nó là cũ nên đc lưu trên server r, antd chỉ hiện lên luôn
// (ví dụ: https://example.com/tour-nhat-ban.jpg)
// TH ảnh vừa chọn chưa lưu trên server (ví dụ C:\Users\Desktop\hinh.png). Nó sẽ ko hiển thị đc

// Mục đích của getBase64
// Nó sẽ đọc trực tiếp tệp tin ảnh từ máy tính của bạn, sau đó mã hóa nội dung bức ảnh thành một chuỗi văn bản rất dài
// (gọi là chuỗi Base64, có dạng data:image/jpeg;base64,iVBORw0KGgo...).
// -> Chuỗi văn bản dài ngoằng này đóng vai trò y hệt như một đường link URL.

// Mục đích của handleImagePreview
// Là để phân loại ảnh
// Nếu là ảnh cũ (đã có link file.url)
// Nếu là ảnh mới (chưa có link): Nó sẽ gọi hàm getBase64 ra để biến tệp tin thành chuỗi Base64.
// Sau đó nó lưu chuỗi này lại (vào file.preview)

// FileReader: công cụ có sẵn trong trình duyệt giúp đọc nội dung của các tệp (như file ảnh, văn bản).
// reader.readAsDataURL: Lệnh bắt đầu đọc tệp gốc trong máy tính và chuyển đổi nó thành một chuỗi mã hóa Base64
// reader.onload: Kích hoạt khi file đc đọc thành công
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const handleImagePreview = (file, setPreviewSrc, setPreviewOpen) => {
  //Nếu đã có url từ ảnh cũ
  if (file.url) {
    setPreviewSrc(file.url);
    setPreviewOpen(true);
    return;
  }

  //Nếu file.preview chưa có
  if (!file.preview) {
    getBase64(file.originFileObj).then((result) => {
      file.preview = result;
      setPreviewSrc(file.preview);
      setPreviewOpen(true);
    });
  } else {
    setPreviewSrc(file.preview);
    setPreviewOpen(true);
  }
};
