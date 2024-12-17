import axios from "axios";
import { getCookie } from "cookies-next";
import endpoints from "./endpoints";
import { Product } from "@/types/entities.types";
import { Query } from "./types";
import { formatQueryString } from "./utils";
import { omit } from "lodash";

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

export const getProducts = (query: Query = {}) => {
  return api.get(endpoints.products.list + formatQueryString(query));
};

export const createProduct = (product: Partial<Product>) => {
  return api.post(endpoints.products.create, omit(product, "id"));
};

export const editProduct = (product: Partial<Product>) => {
  return api.put(endpoints.products.edit + `/${product.id}`, product);
};

export const deleteProduct = (id: number) => {
  return api.delete(endpoints.products.delete + `/${id}`);
};
