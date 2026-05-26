import axios from 'axios';

// Base URL – adjust if backend runs on a different port
// Vite exposes env vars on `import.meta.env`; avoid `process` in browser bundles
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://study-planner-backend-d5f9.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
