
import axios from "axios";

export const authRequest = axios.create({
  baseURL: "http://localhost:30000/api",
  withCredentials: true,
});
export const userRequest = axios.create({
  baseURL: "http://localhost:30001/api",
  withCredentials: true,
});
export const postRequest = axios.create({
  baseURL: "http://localhost:30002/api",
  withCredentials: true,
});
export const likeRequest = axios.create({
  baseURL: "http://localhost:30003/api",
  withCredentials: true,
});
export const commentRequest = axios.create({
  baseURL: "http://localhost:30004/api",
  withCredentials: true,
});
