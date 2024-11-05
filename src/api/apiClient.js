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
    //const token = getToken(); // Call the function to get the token
    const token = "877cd671cf75b4ad4afde7686487f9f510b2283daab876d6d321adc74b4ae954d173b70a5725f4785f88ee735b6807fbddd9a5d88697d8bb304dd02913bc735f71362403014dcc25b0340769f4c5da41ec203153868394808fac143f167988ef537bf218cd51f15a07cd9225e773eb2aa7e238882f0870bc950ae70bc5336fb2"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;