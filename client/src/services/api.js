import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Track if we're already redirecting to prevent loops
let isRedirecting = false;

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      console.log('Rate limited, retrying in 2 seconds...');
      // Wait 2 seconds and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      return api.request(error.config);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      // Reset redirect flag after a delay
      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default api;