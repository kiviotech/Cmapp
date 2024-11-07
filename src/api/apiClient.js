import axios from "axios";
import { getToken } from "../utils/storage";
import { Platform } from "react-native";

// Configure base URLs based on platform
const BASE_URL = Platform.select({
  web: "http://localhost:1337/api",
  android: "http://192.168.0.253:1337/api",
  // ios: "http://localhost:1337/api", // For iOS simulator
});

const MEDIA_BASE_URL = Platform.select({
  web: "http://localhost:1337",
  android: "http:/192.168.0.253:1337",
  // ios: "http://localhost:1337",
});

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken(); // Call the function to get the token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { BASE_URL, MEDIA_BASE_URL };
export default apiClient;
