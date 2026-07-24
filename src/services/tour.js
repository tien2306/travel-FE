import { del, get, patch, patchWithFile, postWithFile } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

// Lấy tour ở user
export const getToursUser = async () => {
  const result = await get(ENDPOINTS.TOURS);
  return result;
};

// Lấy tour ở user
export const getTours = async (page = 1) => {
  const result = await get(`${ENDPOINTS.TOURS}?page=${page}`);
  return result;
};

// Chi tiết tour
export const getTourBySlug = async (slug) => {
  const result = await get(`${ENDPOINTS.TOURS}/slug/${slug}`);
  return result;
};

//Lấy tour ở admin
export const getToursAdmin = async (page = 1) => {
  const result = await get(`${ENDPOINTS.TOURS_ADMIN}/all?page=${page}`);
  return result;
};

// Chỉnh sửa tour, chỉnh sửa bằng id tour
export const updateTour = async (id, formData) => {
  const result = await patchWithFile(formData, `${ENDPOINTS.TOURS}/${id}`);
  return result;
};

// Tạo tour
export const createTour = async (formData) => {
  const result = await postWithFile(formData, ENDPOINTS.TOURS);
  return result;
};

// Xóa tour, xóa bằng id tour
export const deleteTour = async (id) => {
  const result = await del(`${ENDPOINTS.TOURS}/${id}`);
  return result;
};

export const updateTourStatus = async (id, statusData) => {
  // statusData truyền vào sẽ có dạng: { status: "ACTIVE" } hoặc { status: "INACTIVE" }
  const result = await patch(statusData, `${ENDPOINTS.TOURS}/${id}`);
  return result;
};

// Lấy tour bằng bộ lọc
export const getToursFilter = async (filterParams = {}) => {
  let keywordStr =
    filterParams.keyword && filterParams.keyword !== ""
      ? `&keyword=${filterParams.keyword}`
      : "";
  let destStr =
    filterParams.destination && filterParams.destination !== ""
      ? `&destination=${filterParams.destination}`
      : "";
  let deptStr =
    filterParams.departurePlace && filterParams.departurePlace !== ""
      ? `&departurePlace=${filterParams.departurePlace}`
      : "";
  let minPStr =
    filterParams.minPrice && filterParams.minPrice !== ""
      ? `&minPrice=${filterParams.minPrice}`
      : "";
  let maxPStr =
    filterParams.maxPrice && filterParams.maxPrice !== ""
      ? `&maxPrice=${filterParams.maxPrice}`
      : "";
  let startDateStr =
    filterParams.startDate && filterParams.startDate !== ""
      ? `&startDate=${filterParams.startDate}`
      : "";
  let categoryStr =
    filterParams.category && filterParams.category !== ""
      ? `&category=${filterParams.category}`
      : "";
  let transportStr =
    filterParams.transport && filterParams.transport !== ""
      ? `&transport=${filterParams.transport}`
      : "";
  let sortByStr =
    filterParams.sortBy && filterParams.sortBy !== ""
      ? `&sortBy=${filterParams.sortBy}`
      : "";
  let sortOrderStr =
    filterParams.sortOrder && filterParams.sortOrder !== ""
      ? `&sortOrder=${filterParams.sortOrder}`
      : "";
  const page = filterParams.page || 1;
  const limit = filterParams.limit || 12;

  const api = `${ENDPOINTS.TOURS_FILTER}?page=${page}&limit=${limit}${keywordStr}${destStr}${deptStr}${minPStr}${maxPStr}${startDateStr}${categoryStr}${transportStr}${sortByStr}${sortOrderStr}`;

  const result = await get(api);
  return result;
};
