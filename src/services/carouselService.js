import { del, get, patch, patchWithFile, postWithFile } from "../utils/request";

export const getCarousel = async (page = 1) => {
  const result = await get(`hero-carousels/admin?page=${page}`);
  return result;
};

export const createCarousel = async (formData) => {
  const result = await postWithFile(formData, "hero-carousels/");
  return result;
};

export const updateCarousel = async (id, formData) => {
  const result = await patchWithFile(formData, `hero-carousels/${id}`);
  return result;
};

export const deleteCarousel = async (id) => {
  const result = await del(`hero-carousels/${id}`);
  return result;
};

export const updateCarouselStatus = async (id, statusData) => {
  // statusData truyền vào sẽ có dạng: { isActive: true } hoặc { isActive: false }
  const result = await patch(statusData, `hero-carousels/${id}`);
  return result;
};
