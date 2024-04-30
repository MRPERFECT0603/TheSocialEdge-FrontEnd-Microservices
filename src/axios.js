
import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:8000/api",
  // baseURL: "https://thesocialedge-api.onrender.com",
  withCredentials: true,
});