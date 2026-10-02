import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/auth/auth-store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach Bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // NestJS validation errors arrive as message: string[]; forms expect one string.
    const data = error.response?.data;
    if (data && Array.isArray(data.message)) {
      data.message = data.message.join(", ");
    }

    // A 401 on /login means bad credentials, not an expired session.
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      Cookies.remove("access_token");
      useAuthStore.getState().logout();
      // Full navigation (not router.push) also drops the in-memory React Query cache.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- interceptor runs outside React; hard reload is intended
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
