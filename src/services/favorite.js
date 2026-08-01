import { get, post } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

// Lấy danh sách tour đã yêu thích của user
export const getFavorites = async () => {
  const result = await get(ENDPOINTS.FAVORITES);
  return result;
};

// Hiển thị trạng thái Yêu thích cho 1 trang Chi Tiết Tour
export const getFavoriteStatus = async (tourId) => {
  const result = await get(`${ENDPOINTS.FAVORITES}/${tourId}`);
  return result;
};

// Thêm tour vào danh sách yêu thích
export const addFavorite = async (tourId) => {
  const result = await post({}, `${ENDPOINTS.FAVORITES}/${tourId}`);
  return result;
};

// Xoá tour khỏi danh sách yêu thích
export const removeFavorite = async (tourId) => {
  const result = await post({}, `${ENDPOINTS.FAVORITES}/${tourId}`);
  return result;
};
