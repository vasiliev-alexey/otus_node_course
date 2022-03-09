import axios from "axios";

import { storage } from "./db";

export const API_URL = `http://localhost:4000/`;

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.get<{ accessToken: string }>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        // localStorage.setItem("token", response.data.accessToken);
        return axiosClient.request(originalRequest);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("User nor authorized");
      }
    }
    // throw error;
  }
);

export default axiosClient;
