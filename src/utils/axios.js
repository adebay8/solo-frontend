import axios from "axios";
import { getToken } from "./helper";

export const solo = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});
