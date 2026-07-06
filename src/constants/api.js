export const API_DOMAIN = process.env.REACT_APP_API_URL;

// ----------------------------------------------------------
// ENDPOINTS: Các đường dẫn endpoint gọi API
// Sử dụng trong tầng services/ thông qua utils/request.js
// ----------------------------------------------------------
export const ENDPOINTS = {
  HERO_CAROUSEL: "hero-carousels/",
  HERO_CAROUSEL_ADMIN: "hero-carousels/admin",
  TOURS: "tours",
  AUTH_LOGIN: "auth/login",
  AUTH_REGISTER: "auth/register",
  USERS: "users",
  // ANSWERS: "answers",
  QUESTIONS: "questions",
};

// ----------------------------------------------------------
// IMAGE_URLS: Đường dẫn gốc để render ảnh từ server
// Sử dụng trong tầng components/ và page/
// Cách dùng: IMAGE_URLS.HERO_CAROUSEL + filename
// ----------------------------------------------------------
export const IMAGE_URLS = {
  HERO_CAROUSEL: `${API_DOMAIN}hero-carousels/image/`,
  TOURS: `${API_DOMAIN}tours/image/`,
};
