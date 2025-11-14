// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Thêm interceptor để gắn token từ sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // Lấy token theo từng tab
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
