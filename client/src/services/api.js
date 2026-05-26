import axios from 'axios';

// Base URL – adjust if backend runs on a different port
// Vite exposes env vars on `import.meta.env`; avoid `process` in browser bundles
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://study-planner-backend-d5f9.onrender.com/api';

console.log(`[API] Connecting to: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    console.error('[API Error]', error.message, error.response?.status);
    return Promise.reject(error);
  }
);

export default api;
