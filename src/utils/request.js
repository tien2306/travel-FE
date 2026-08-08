import { getCookie } from "../helpers/auth/cookie";
import { API_DOMAIN } from "../constants/api";

const getAuthHeaders = () => {
  const token = getCookie("accessToken");
  const lang = localStorage.getItem("app_language") || "en";
  
  const headers = {
    "Accept-Language": lang,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

export const get = async (path) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  return data;
};

export const post = async (options, path) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(options),
  });
  const result = await res.json();
  return result;
};

export const del = async (path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  const result = await response.json();
  return result;
};

export const patch = async (option, path) => {
  const respone = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(option),
  });
  const result = await respone.json();
  return result;
};

//Upload file
export const postWithFile = async (formData, path) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  const result = await res.json();
  return result;
};

export const patchWithFile = async (formData, path) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  const result = await res.json();
  return result;
};
