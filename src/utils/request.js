import { getCookie } from "../helpers/cookie";

const API_DOMAIN = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = getCookie("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
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
