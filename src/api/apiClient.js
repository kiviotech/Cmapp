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
      config.headers.Authorization = `Bearer 6c22d78136c46147b9142e51e4e63cf8df9aaeb2c927e3465bd9e2cbcaa5679ee636ad00bffe1bd07d79d151956f703089a9ec773fcfd290deb176ea674dcc020f8b082487c10e650d2d3a53bb95e306330cf5851e3a3153a94338d5e36ede07b8ac8ffcb8614b0d1277bae502f3356224bdba2477edaf2f8f16d655af402cff`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;