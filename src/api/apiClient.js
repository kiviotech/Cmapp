import axios from "axios";
import { getToken } from "../utils/storage";
import { Platform } from "react-native";
import useAuthStore from "../../useAuthStore";

// Configure base URLs based on platform
// const BASE_URL = Platform.select({
//   web: "http://localhost:1337/api",
//   android: "http://192.168.0.253:1337/api",
// ios: "http://localhost:1337/api", // For iOS simulator
// web: "https://cmappapi.kivio.in/api",
// android: "https://cmappapi.kivio.in/api",
// });
// ==================================================
const BASE_URL = Platform.select({
  web: "https://cmappapi.kivio.in/api",
  android: "https://cmappapi.kivio.in/api",
  // ios: "http://localhost:1337/api", // For iOS simulator
});

const URL = Platform.select({
  web: "https://cmappapi.kivio.in",
  android: "https://cmappapi.kivio.in",
});

const MEDIA_BASE_URL = Platform.select({
  web: "https://cmappapi.kivio.in/api",
  android: "https://cmappapi.kivio.in/api",
  // ios: "http://localhost:1337",
});
// ====================================================
// const MEDIA_BASE_URL = Platform.select({
//   web: "http://localhost:1337",
//   android: "http:/192.168.0.253:1337",
// ios: "http://localhost:1337",
// web: "https://cmappapi.kivio.in",
// android: "https://cmappapi.kivio.in",
// });

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { BASE_URL, MEDIA_BASE_URL, URL };
export default apiClient;
