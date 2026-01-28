// frontend/src/services/api.js
import axios from "axios";

// For Vercel, use relative paths since backend/frontend share domain
const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Increase timeout for serverless cold starts
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cache control for serverless
    if (config.method === "get") {
      config.headers["Cache-Control"] = "no-cache";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle serverless cold start
    if (error.code === "ECONNABORTED") {
      console.warn("Request timeout - retrying...");
      // Optionally implement retry logic here
    }

    // Handle Vercel-specific 502/504 errors
    if ([502, 503, 504].includes(error.response?.status)) {
      console.error("Vercel serverless function error - cold start?");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
