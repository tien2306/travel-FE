import { getCookie } from "../helpers/cookie";

const API_DOMAIN = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = getCookie("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseResponse = async (response) => {
  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = {
      message: text,
    };
  }

  if (!response.ok) {
    return {
      success: false,
      message:
        data.message ||
        data.error ||
        data.errors?.[0]?.message ||
        data.errors?.[0] ||
        response.statusText ||
        "Request failed",
      data: data.data,
      status: response.status,
    };
  }

  return Object.keys(data).length > 0
    ? {
        success: data.success ?? true,
        ...data,
      }
    : {
        success: true,
        message: "Success",
      };
};

export const get = async (path) => {
  const res = await fetch(API_DOMAIN + path, {
    method: "GET",
    headers: {
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
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });
  return parseResponse(response);
};

export const patch = async (option, path) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(option),
  });
  return parseResponse(response);
};
