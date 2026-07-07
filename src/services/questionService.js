import { get } from "../utils/request";
import { ENDPOINTS } from "../constants/api";

export const getListQuestion = async (id) => {
  const result = await get(`${ENDPOINTS.QUESTIONS}?topicId=${id}`);
  return result;
};
