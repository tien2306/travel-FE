import { del, get, patch, patchWithFile, postWithFile } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

export const getCarouselUser = async () => {
  const result = await get(ENDPOINTS.HERO_CAROUSEL);
  return result;
};

export const getCarousel = async (page = 1) => {
  const result = await get(`${ENDPOINTS.HERO_CAROUSEL_ADMIN}?page=${page}`);
  return result;
};

export const createCarousel = async (formData) => {
  const result = await postWithFile(formData, ENDPOINTS.HERO_CAROUSEL);
  return result;
};

export const updateCarousel = async (id, formData) => {
  const result = await patchWithFile(formData, `${ENDPOINTS.HERO_CAROUSEL}${id}`);
  return result;
};

export const deleteCarousel = async (id) => {
  const result = await del(`${ENDPOINTS.HERO_CAROUSEL}${id}`);
  return result;
};

export const updateCarouselStatus = async (id, statusData) => {
  // statusData truyền vào sẽ có dạng: { isActive: true } hoặc { isActive: false }
  const result = await patch(statusData, `${ENDPOINTS.HERO_CAROUSEL}${id}`);
  return result;
};
