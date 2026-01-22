import axios from "axios";
import store from "../redux/store";

const api = axios.create({
  baseURL: "http://localhost/User/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Automatically attach JWT
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;