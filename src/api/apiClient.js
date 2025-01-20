import axios from "axios";
import { getToken } from "../utils/storage";
import { Platform } from "react-native";
import useAuthStore from "../../useAuthStore";

// Configure base URLs based on platform

const BASE_URL = Platform.select({
  // web: "http://localhost:1337/api",
  web: "https://cmappapi.kivio.in/api",
  android: "https://cmappapi.kivio.in/api",
  // ios: "http://localhost:1337/api", // For iOS simulator
});

const URL = Platform.select({
  // web: "http://localhost:1337",
  web: "https://cmappapi.kivio.in",
  android: "https://cmappapi.kivio.in",
});

const MEDIA_BASE_URL = Platform.select({
  // web: "http://localhost:1337/api",
  web: "https://cmappapi.kivio.in/api",
  android: "https://cmappapi.kivio.in/api",
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
// apiClient.interceptors.request.use(
//   config => {
//     const token = getToken(); // Call the function to get the token
//     // const token = "a05f3be82c43251ee1d22179dc66d6a9f6b0a1181ea5c431f5e82ae3862544ab34e020c0e2c23801f8fefd6d57ea9c39ccb3899c2e26f0d6b1a8bf88c06692568e9299167587f0f324d8d08e5d4f1d58310151263bdc6e4296adbcb5e2e3e67610a125eb701cb164c8e4d1431c837902615041c7974d5167369e11f2c45f77f6"
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken(); // Ensure the function call is correct
      // console.log('Fetched token:', token); // Debugging log

      if (token) {
        config.headers.Authorization = Bearer`${token}`;
        //console.log("Token set in headers"); // Debugging log
      } else {
        //console.warn("No token available"); // Warn if no token is found
      }
    } catch (error) {
      console.error("Error fetching token:", error); // Log any error in fetching the token
    return config;
  },
  (error) => Promise.reject(error)
);

export { BASE_URL, MEDIA_BASE_URL, URL };
export default apiClient;
