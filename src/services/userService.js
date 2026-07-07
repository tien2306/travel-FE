import { get, post } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

export const login = async (options) => {
  const result = await post(options, ENDPOINTS.AUTH_LOGIN);

  // const users = result.find(
  //   (u) => u.email === email && u.password === password,
  // );

  // return users ? [users] : [];
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
