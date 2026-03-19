import axios from "axios";

export const API = axios.create({
  // baseURL: "http://localhost:5000/api"
  baseURL:"https://usermanagementsystem-venu-developer.onrender.com"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
