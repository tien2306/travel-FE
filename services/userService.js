import { get, post } from "../../utils/request";

export const login = async (email, password) => {
  const result = await get("users");

  const users = result.find(
    (u) => u.email === email && u.password === password,
  );

  return users ? [users] : [];
};

export const register = async (options) => {
  const result = await post(options, "users");
  return result;
};

export const checkExist = async (key, value) => {
  const result = await get(`users?${key}=${value}`);
  return result;
};
