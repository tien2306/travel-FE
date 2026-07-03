import { del, get, patch, post } from "../utils/request";

export const getTour = async (page = 1) => {
  const result = await get(`tours?page=${page}`);
  return result;
};

export const createTour = async (options) => {
  const result = await post(options, "tours");
  return result;
};

export const updateTour = async (id, options) => {
  const result = await patch(options, `tours/${id}`);
  return result;
};

export const deleteTour = async (id) => {
  const result = await del(`tours/${id}`);
  return result;
};
