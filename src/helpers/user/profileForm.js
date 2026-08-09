/**
 * Xử lý dữ liệu form Profile trước khi gửi lên API
 * @param {Object} values - Các giá trị từ form
 * @param {Object} userInfo - Thông tin user hiện tại (để lấy avatar cũ làm fallback)
 * @returns {Object} { formData, newAvatarUrl }
 */
export const buildProfilePayload = (values, userInfo) => {
  const formData = new FormData();

  // Chỉ gửi những gì bị thay đổi!
  if (values.fullName !== userInfo?.fullName) {
    formData.append("fullName", values.fullName);
  }
  if (values.phone !== userInfo?.phone) {
    formData.append("phone", values.phone || "");
  }
  if (values.address !== userInfo?.address) {
    formData.append("address", values.address || "");
  }

  // XỬ LÝ AVATAR
  const avatarVal = values.avatar; // Gía trị ảnh mới
  let newAvatarUrl = userInfo?.avatar; // Gía trị ảnh cũ

  // Nếu avatar có sự thay đổi so với cái đang lưu trong Database
  if (avatarVal !== userInfo?.avatar) {
    if (!avatarVal) {
      // TH1: Bấm xóa ảnh (avatarVal rỗng)
      formData.append("avatar", "");
      newAvatarUrl = null;
    } else if (typeof avatarVal === "string") {
      // TH2: Chọn ảnh mẫu (preset) -> dạng string
      formData.append("avatar", avatarVal);
      newAvatarUrl = avatarVal;
    } else if (avatarVal.file) {
      // TH3: Tải ảnh từ máy tính -> dạng Object { file, preview }
      formData.append("avatar", avatarVal.file);
      newAvatarUrl = avatarVal.preview;
    }
  }

  return { formData, newAvatarUrl };
};
