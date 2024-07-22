import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_NIMELSSA_BASE_URL,
});

axiosInstance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error) => {
    if (typeof error.response === "undefined") {
      useNuxtApp().$toast.error("kindly check your network connection", {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    } else {
      useNuxtApp().$toast.error(error.response.data.message, {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    }
  }
);