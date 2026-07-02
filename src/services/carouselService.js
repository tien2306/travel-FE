import { get } from "../utils/request";

export const getCarousel = async (page) => {
  const result = await get(`hero-carousels`);
  return result;
};
