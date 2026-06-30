import { get } from "../utils/request";

export const getTour = async (page) => {
  const result = await get(`tours?page=${page}`);
  return result;
};
