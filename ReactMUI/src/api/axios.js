import axios from "axios";

const TOKEN_STORAGE_KEY = "optional_access_token";
const USER_STORAGE_KEY = "optional_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
  try {
    return JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY) ?? "null");
  } catch {
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

export default api;