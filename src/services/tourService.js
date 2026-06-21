import { get } from "../utils/request";

export const getTour = async () => {
  const result = await get(`tours`);
  return result;
};
