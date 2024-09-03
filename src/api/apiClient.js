import axios from 'axios';
import { getToken } from '../utils/storage';

export const BASE_URL = 'http://localhost:1338/api';
export const MEDIA_BASE_URL = 'http://localhost:1338';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = getToken(); // Call the function to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;