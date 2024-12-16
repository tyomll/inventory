import axios from "axios";
import { getCookie } from "cookies-next";
import endpoints from "./endpoints";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (email: string, password: string) => {
  return api.post(endpoints.auth.login, { email, password });
};

export const register = (email: string, password: string) => {
  return api.post(endpoints.auth.register, { email, password });
};
