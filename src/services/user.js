import { get, patchWithFile, post } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

export const login = async (options) => {
  const result = await post(options, ENDPOINTS.AUTH_LOGIN);
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

export const register = async (options) => {
  const result = await post(options, ENDPOINTS.AUTH_REGISTER);
  return result;
};

export const checkExist = async (key, value) => {
  const result = await get(`${ENDPOINTS.USERS}?${key}=${value}`);
  return result;
};
