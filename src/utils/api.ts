import axios, { AxiosInstance } from "axios";
import { getCookie } from "cookies-next";
const api = process.env.NEXT_PUBLIC_BACKEND_API;

function getAccessTokenFromLocalStorage(): string | undefined {
  return getCookie("token");
}

export const authorizedApi: AxiosInstance = axios.create({
  baseURL: api,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

authorizedApi.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const unauthorizedApi: AxiosInstance = axios.create({
  baseURL: api,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});
