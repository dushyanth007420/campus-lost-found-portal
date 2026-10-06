import axios from 'axios';

// Backend server URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://campus-lost-found-portal-rlf5.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
