import axios from 'axios';
import { getToken } from '../utils/storage';

export const BASE_URL = 'https://cmapp.kivio.in/dash/api';
export const MEDIA_BASE_URL = 'https://cmapp.kivio.in/dash/';

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