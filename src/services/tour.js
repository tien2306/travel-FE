import { del, get, patch, patchWithFile, postWithFile } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

export const getToursUser = async () => {
  const result = await get(ENDPOINTS.TOURS);
  return result;
};

export const getTours = async (page = 1) => {
  const result = await get(`${ENDPOINTS.TOURS}?page=${page}`);
  return result;
};
export const getToursAdmin = async (page = 1) => {
  const result = await get(`${ENDPOINTS.TOURS_ADMIN}/all?page=${page}`);
  return result;
};

export const createTour = async (formData) => {
  const result = await postWithFile(formData, ENDPOINTS.TOURS);
  return result;
};

export const updateTour = async (id, formData) => {
  const result = await patchWithFile(formData, `${ENDPOINTS.TOURS}/${id}`);
  return result;
};

export const deleteTour = async (id) => {
  const result = await del(`${ENDPOINTS.TOURS}/${id}`);
  return result;
};

export const updateTourStatus = async (id, statusData) => {
  // statusData truyền vào sẽ có dạng: { status: "ACTIVE" } hoặc { status: "INACTIVE" }
  const result = await patch(statusData, `${ENDPOINTS.TOURS}/${id}`);
  return result;
};
