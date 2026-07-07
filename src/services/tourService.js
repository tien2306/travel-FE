import { del, get, patch, post } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

export const getTour = async (page = 1) => {
  const result = await get(`${ENDPOINTS.TOURS}?page=${page}`);
  return result;
};

export const createTour = async (options) => {
  const result = await post(options, ENDPOINTS.TOURS);
  return result;
};

export const updateTour = async (id, options) => {
  const result = await patch(options, `${ENDPOINTS.TOURS}/${id}`);
  return result;
};

export const deleteTour = async (id) => {
  const result = await del(`${ENDPOINTS.TOURS}/${id}`);
  return result;
};
