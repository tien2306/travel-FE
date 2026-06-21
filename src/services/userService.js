import { get, post } from "../utils/request";

export const login = async (options) => {
  const result = await post(options, "auth/login");

  // const users = result.find(
  //   (u) => u.email === email && u.password === password,
  // );

  // return users ? [users] : [];
  return result;
};

export const register = async (options) => {
  const result = await post(options, "auth/register");
  return result;
};

export const checkExist = async (key, value) => {
  const result = await get(`users?${key}=${value}`);
  return result;
};
