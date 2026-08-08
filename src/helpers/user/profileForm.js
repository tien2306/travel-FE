/**
 * Xử lý dữ liệu form Profile trước khi gửi lên API
 * @param {Object} values - Các giá trị từ form
 * @param {Object} userInfo - Thông tin user hiện tại (để lấy avatar cũ làm fallback)
 * @returns {Object} { formData, newAvatarUrl }
 */
export const buildProfilePayload = (values, userInfo) => {
  const formData = new FormData();
  
  formData.append("fullName", values.fullName);
  formData.append("phone", values.phone || "");
  formData.append("address", values.address || "");

  // Xử lý Avatar:
  // - Có thể là string (ảnh giữ nguyên / chọn từ preset)
  // - Có thể là object { file, preview } (ảnh mới upload)
  // - Có thể là empty/null (user đã xóa ảnh)
  const avatarVal = values.avatar;
  let newAvatarUrl = userInfo?.avatar;

  if (avatarVal) {
    if (typeof avatarVal === "string") {
      // Ảnh có sẵn từ server hoặc url preset
      formData.append("avatar", avatarVal);
      newAvatarUrl = avatarVal;
    } else if (avatarVal.file) {
      // File ảnh upload mới
      formData.append("avatar", avatarVal.file);
      newAvatarUrl = avatarVal.preview;
    }
  } else {
    // Xóa ảnh
    formData.append("avatar", "");
    newAvatarUrl = null;
  }

  return { formData, newAvatarUrl };
};
