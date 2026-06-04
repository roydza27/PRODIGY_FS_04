import axios from "axios";
import { useAuthStore } from "@/app/stores/auth.store";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function readStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

api.interceptors.request.use((config) => {
  const storeToken = useAuthStore.getState().token;
  const storageToken = readStoredToken();
  const token = storeToken || storageToken;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});