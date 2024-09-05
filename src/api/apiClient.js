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
      config.headers.Authorization = `Bearer eb5f8686cb988441499e7f3cea219329358b9a40d6e91b4af6214f08744f277cb96cfb516ca66cab2332b3100a8363ae5355697d01286d4e99979bdcc0d85d19a363390d461e68c3cd1af57cfcdefbc58547a940c4d22b8647ed91f360d4da29564085106f4f73a7f278a810c5927d43120e73ad911a4a31258605148a994529`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;