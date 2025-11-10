"use client";

import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { getConfig } from "@/lib/config";
import { useAuthStore } from "@/features/auth/auth-store";

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const { apiBaseUrl } = getConfig();

/**
 * Get CSRF token from cookie.
 * The backend sets this token on successful authentication.
 */
function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") {
    return config;
  }
  
  // Add Authorization header if we have an access token
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add CSRF token for state-changing requests
  // Auth endpoints are exempt on the backend, but we include it anyway for consistency
  const method = config.method?.toUpperCase();
  const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(method || "");
  
  if (isStateChanging) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableRequestConfig | undefined;
    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      typeof window !== "undefined" &&
      !config.url?.startsWith("/auth/")
    ) {
      config._retry = true;
      try {
        const tokens = await useAuthStore.getState().refresh();
        const headers = AxiosHeaders.from(config.headers ?? {});
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        config.headers = headers;
        return apiClient(config);
      } catch (refreshError) {
        useAuthStore.getState().markSessionExpired();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
