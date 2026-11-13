import axios from "axios";

const TOKEN_STORAGE_KEY = "optional_access_token";
const USER_STORAGE_KEY = "optional_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Initialize authorization header from session storage if token exists
const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
if (storedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
}

export function getStoredUser() {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);

  if (!token || !storedUser) {
    clearAuthSession();
    return null;
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user || typeof user !== "object" || Array.isArray(user)) {
      clearAuthSession();
      return null;
    }

    return user;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function setAuthSession(token, user) {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
  delete api.defaults.headers.common.Authorization;
}

export function getApiErrorMessage(error, fallback) {
  const validationErrors = error.response?.data?.errors;
  const firstValidationError = validationErrors
    ? Object.values(validationErrors).flat().find((message) => typeof message === "string")
    : null;

  return firstValidationError ?? error.response?.data?.message ?? fallback;
}

export function getApiFieldErrors(error) {
  const validationErrors = error.response?.data?.errors;
  if (!validationErrors || typeof validationErrors !== "object") return {};

  return Object.fromEntries(
    Object.entries(validationErrors).flatMap(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages;
      return typeof message === "string" ? [[field, message]] : [];
    })
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestPath = error.config?.url?.split("?")[0];
    const isAuthEndpoint = ["/login", "/register", "/logout"].includes(requestPath);

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      sessionStorage.getItem(TOKEN_STORAGE_KEY)
    ) {
      clearAuthSession();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default api;