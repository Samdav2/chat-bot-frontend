import axios from 'axios';
import { getApiBaseUrl } from './constants';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token and ensure dynamic baseURL
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('agent_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('agent_token');
      localStorage.removeItem('agent_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
