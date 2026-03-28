// frontend/src/api/axios.js
import axios from 'axios';

// Backend root (no /api). Local: http://localhost:5000. On Vercel set REACT_APP_API_URL.
const API_ROOT = (process.env.REACT_APP_API_URL || 'http://localhost:5000')
  .replace(/\/$/, '')
  .replace(/\/api$/, '');

export const API_ORIGIN = API_ROOT;

const API = axios.create({
  baseURL: `${API_ROOT}/api`,
});

// Attach the JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server returns 401 (token expired/invalid), clear localStorage
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
