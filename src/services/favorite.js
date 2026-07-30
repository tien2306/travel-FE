import { get, post, del } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

// Lấy danh sách tour đã yêu thích của user
export const getFavorites = async () => {
  const result = await get(ENDPOINTS.FAVORITES);
  return result;
};

// Thêm tour vào danh sách yêu thích
export const addFavorite = async (tourId) => {
  const result = await post({ tourId }, ENDPOINTS.FAVORITES);
  return result;
};

// Xoá tour khỏi danh sách yêu thích
export const removeFavorite = async (tourId) => {
  const result = await del(`${ENDPOINTS.FAVORITES}/${tourId}`);
  return result;
};
