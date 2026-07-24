export const API_DOMAIN = process.env.REACT_APP_API_URL;

export const ENDPOINTS = {
  HERO_CAROUSEL: "hero-carousels/",
  HERO_CAROUSEL_ADMIN: "hero-carousels/admin",
  TOURS: "tours",
  TOURS_FILTER: "tours/filter",
  TOURS_ADMIN: "tours/admin",
  AUTH_LOGIN: "auth/login",
  AUTH_REGISTER: "auth/register",
  USERS: "users",
  ANSWERS: "answers",
  QUESTIONS: "questions",
};

export const IMAGE_URLS = {
  HERO_CAROUSEL: `${API_DOMAIN}hero-carousels/image/`,
  TOURS: `${API_DOMAIN}tours/image/`,
};

export let params = {
  keyword: "",
  destination: "",
  departurePlace: "",
  minPrice: "0",
  maxPrice: "400000000",
  startDate: "",
  category: "",
  transport: "",
  sortBy: "",
  sortOrder: "",
  page: 1,
  limit: 12,
};
