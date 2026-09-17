import { get, patch, post } from "../utils/request";

// 1. Đặt tour
export const createBooking = async (data) => {
  const result = await post(data, "bookings");
  return result;
};

// 2. Xem lịch sử đặt tour của người dùng
export const getMyBookings = async (params = {}) => {
  let queryString = "";
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    queryString = `?${searchParams.toString()}`;
  }
  const result = await get(`bookings/my${queryString}`);
  return result;
};

// 3. Xem chi tiết booking
export const getBookingDetails = async (id) => {
  const result = await get(`bookings/${id}`);
  return result;
};

// 4. Hủy booking
export const cancelBooking = async (id, data) => {
  const result = await patch(data, `bookings/${id}/cancel`);
  return result;
};
