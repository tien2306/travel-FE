import { IMAGE_URLS } from "../../constants/api";

/**
 * Chuyển đổi giá trị avatar thành URL hiển thị được
 * - Nếu null/rỗng → trả về null
 * - Nếu là object (từ Form.Item khi vừa upload) → lấy thuộc tính preview
 * - Nếu là URL hợp lệ (http, data:, /static, blob:) → dùng luôn
 * - Nếu là file ID từ server (VD: "AgACAgUAAvk...") → ghép với IMAGE_URLS.AVATARS
 */
export const getAvatarDisplayUrl = (avatarValue) => {
  if (!avatarValue) return null;

  if (typeof avatarValue === "object" && avatarValue.preview) {
    return avatarValue.preview;
  }

  const cleanUrl = String(avatarValue).trim();
  if (!cleanUrl) return null;

  if (
    cleanUrl.startsWith("http") ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("/static") ||
    cleanUrl.startsWith("blob:")
  ) {
    return cleanUrl;
  }

  // File ID từ server → ghép với base URL
  return `${IMAGE_URLS.AVATARS}${cleanUrl}`;
};
