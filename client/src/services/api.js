import axios from 'axios';

// Vite exposes env vars on `import.meta.env`; avoid `process` in browser bundles.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : '/api');

console.log(`[API] Connecting to: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Prevent accidental caching of API responses
api.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
api.defaults.headers.common.Pragma = 'no-cache';
api.defaults.headers.common.Expires = '0';
// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers.Pragma = 'no-cache';
  config.headers.Expires = '0';
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
