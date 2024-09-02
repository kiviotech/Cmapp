import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:1337/api/", // Replace with your Strapi base URL
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "bearer cd870a097c0ddec0b736cf963a85c3cd7b08777aa793c1ad480901aa2f1f64332079d1891803dc14d7dedf8559f1522db434b9d6f48330d568307699d3b857155666982188c839c924c3bd8f8f845406b705f589d5263e3a3611b1f0507b9c6f7ea1c39d710301c611637ba5a06f1b2dd26448d6bf7ff296edd225b922653875",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
