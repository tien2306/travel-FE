import { del, get, patch, patchWithFile, postWithFile } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

// CLIENT SERVICES
export const getCarouselUser = async () => {
  const result = await get(ENDPOINTS.HERO_CAROUSEL);
  return result;
};

// ADMIN SERVICES
export const getCarousel = async (page = 1, search = "") => {
  let url = `${ENDPOINTS.HERO_CAROUSEL_ADMIN}?page=${page}`;
  if (search) {
    url += `&keyword=${encodeURIComponent(search)}`;
  }
  const result = await get(url);
  return result;
};

export const createCarousel = async (formData) => {
  const result = await postWithFile(formData, ENDPOINTS.HERO_CAROUSEL);
  return result;
};

export const updateCarousel = async (id, formData) => {
  const result = await patchWithFile(
    formData,
    `${ENDPOINTS.HERO_CAROUSEL}${id}`,
  );
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
