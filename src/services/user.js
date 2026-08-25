import { get, patch, patchWithFile, post, del } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

// CLIENT & AUTH SERVICES
export const login = async (options) => {
  const result = await post(options, ENDPOINTS.AUTH_LOGIN);
  return result;
};

export const register = async (options) => {
  const result = await post(options, ENDPOINTS.AUTH_REGISTER);
  return result;
};

export const getAuthMe = async () => {
  const result = await get(ENDPOINTS.AUTH_ME);
  return result;
};

export const updateAuthMe = async (formData) => {
  const result = await patchWithFile(formData, ENDPOINTS.AUTH_ME);
  return result;
};

export const checkExist = async (key, value) => {
  const result = await get(`${ENDPOINTS.USERS}?${key}=${value}`);
  return result;
};

// ADMIN SERVICES (USER MANAGEMENT)
export const getUsers = async (page = 1, limit = 10, search = "") => {
  let url = `${ENDPOINTS.USERS}?page=${page}&limit=${limit}`;
  if (search) {
    url += `&keyword=${encodeURIComponent(search)}`;
  }
  const result = await get(url);
  return result;
};

// export const getUserByIdAdmin = async (id) => {
//   const result = await get(`${ENDPOINTS.USERS}/${id}`);
//   return result;
// };

export const createUser = async (options) => {
  const result = await post(options, ENDPOINTS.USERS);
  return result;
};

export const updateUser = async (id, options) => {
  const result = await patch(options, `${ENDPOINTS.USERS}/${id}`);
  return result;
};

export const deleteUser = async (id) => {
  const result = await del(`${ENDPOINTS.USERS}/${id}`);
  return result;
};
