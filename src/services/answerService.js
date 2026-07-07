// import { getCookie } from "../helpers/cookie";
import { get, patch, post } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

export const getAnswersByUserId = async (userId) => {
  // const userId = getCookie("id");
  const result = await get(`${ENDPOINTS.ANSWERS}?userId=${userId}`);
  return result;
};

export const getAnswers = async (id) => {
  const result = await get(`${ENDPOINTS.ANSWERS}/${id}`);
  return result;
};

export const createAnswers = async (options) => {
  const result = await post(options, ENDPOINTS.ANSWERS);
  return result;
};

export const updateAnswers = async (options, id) => {
  const result = await patch(options, `${ENDPOINTS.ANSWERS}/${id}`);
  return result;
};
