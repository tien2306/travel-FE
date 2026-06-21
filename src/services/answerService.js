// import { getCookie } from "../helpers/cookie";
import { get, patch, post } from "../utils/request";

export const getAnswersByUserId = async (userId) => {
  // const userId = getCookie("id");
  const result = await get(`answers?userId=${userId}`);
  return result;
};

export const getAnswers = async (id) => {
  const result = await get(`answers/${id}`);
  return result;
};

export const createAnswers = async (options) => {
  const result = await post(options, `answers`);
  return result;
};

export const updateAnswers = async (options, id) => {
  const result = await patch(options, `answers/${id}`);
  return result;
};
