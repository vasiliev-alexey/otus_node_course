import axios from "axios";

export const API_URL = `http://localhost:5000/`;

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

axiosClient.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<{ accessToken: string }>(
          `${API_URL}/refresh`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("token", response.data.accessToken);
        return axiosClient.request(originalRequest);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("User nor authorized");
      }
    }
    throw error;
  }
);

export default axiosClient;
