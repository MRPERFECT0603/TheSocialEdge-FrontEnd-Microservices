
import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:80/",
  withCredentials: true,
});