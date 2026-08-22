import axios from 'axios';

const BACKEND1_URL = import.meta.env.VITE_BACKEND1_URL || 'http://localhost:5000/api/v1';
const BACKEND2_URL = import.meta.env.VITE_BACKEND2_URL || 'http://localhost:8000';

// Backend 1 (Express API)
export const backend1 = axios.create({
  baseURL: BACKEND1_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backend 2 (FastAPI RAG)
export const backend2 = axios.create({
  baseURL: BACKEND2_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptors for helpful error parsing
backend1.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred with Backend 1';
    return Promise.reject(new Error(message));
  }
);

backend2.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred with Backend 2 (RAG Service)';
    return Promise.reject(new Error(message));
  }
);
