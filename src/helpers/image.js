/**
 * Chuyển đổi file tải lên thành Data URL (Base64) để xem trước
 * @param {File} file - File vật lý (originFileObj của antd)
 * @returns {Promise<string>} Chuỗi base64
 */
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // FileReader: công cụ có sẵn trong trình duyệt giúp đọc nội dung của các tệp (như file ảnh, văn bản).
    const reader = new FileReader();
    // Lệnh bắt đầu đọc tệp gốc trong máy tính và chuyển đổi nó thành một chuỗi mã hóa Base64
    reader.readAsDataURL(file);
    // Đăng ký sự kiện: Khi nào trình duyệt đọc file THÀNH CÔNG thì mới kích hoạt đoạn code bên dưới
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Xử lý xem trước ảnh (dành cho Antd Upload)
 * @param {Object} file - File object của Antd Upload
 * @param {Function} setPreviewSrc - State setter để cập nhật url xem trước
 * @param {Function} setPreviewOpen - State setter để mở popup xem trước
 */
export const handleImagePreview = async (
  file,
  setPreviewSrc,
  setPreviewOpen,
) => {
  // console.log(file);
  // TRƯỜNG HỢP 1: Ảnh đã có sẵn link trên mạng (Ảnh cũ lấy từ database/server)
  if (file.url) {
    setPreviewSrc(file.url);
    setPreviewOpen(true);
    return;
  }

  // TRƯỜNG HỢP 2: Ảnh mới chọn từ máy tính và ĐÃ ĐƯỢC ĐỌC TRƯỚC ĐÓ RỒI
  // Nếu chưa có preview (chưa đọc) thì dùng FileReader để đọc
  if (!file.preview) {
    file.preview = await getBase64(file.originFileObj); // Lưu lại chuỗi Base64
  }

  // Nếu có sẵn preview rồi thì mở luôn
  setPreviewSrc(file.preview); // Cập nhật state để hiển thị
  setPreviewOpen(true); // Mở popup
};
