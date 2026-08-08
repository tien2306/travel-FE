import { IMAGE_URLS } from "../../constants/api";
import fallbackImage from "../../assets/images/fallbackImage.jpg";

/**
 * Lấy ngẫu nhiên một ảnh từ data carousel để làm Banner/Hero background
 * @param {Array} bannerData - Danh sách data (vd: lấy từ Carousel API)
 * @param {string} fallbackUrl - Ảnh mặc định nếu danh sách trống hoặc lỗi
 * @returns {string} URL tuyệt đối của ảnh
 */
export const getRandomBannerImage = (
  bannerData,
  fallbackUrl = fallbackImage,
) => {
  if (!bannerData || !Array.isArray(bannerData) || bannerData.length === 0) {
    return fallbackUrl;
  }

  const randomIndex = Math.floor(Math.random() * bannerData.length);
  const apiImageName = bannerData[randomIndex]?.image;

  if (apiImageName) {
    return `${IMAGE_URLS.HERO_CAROUSEL}${apiImageName.trim()}`;
  }

  return fallbackUrl;
};
