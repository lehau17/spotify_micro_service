import { LoginResponseType } from "@/types/ver2/auth.type";
import SuccessResponse from "@/types/ver2/response.type";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const api = axios.create({
  baseURL: "http://dev.haudev.io.vn",
});

// Request interceptor
api.interceptors.request.use((config: any) => {
  const userLocal = localStorage.getItem("user");
  const currentUser = userLocal ? JSON.parse(userLocal) : null;
  const accessToken = localStorage.getItem("access_token");
  config.headers = {
    ...config.headers,
    token: currentUser ? currentUser.token : "",
    authorization: "Bearer " + accessToken,
    tokencybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlSlMgNDIiLCJIZXRIYW5TdHJpbmciOiIwNy8xMi8yMDI0IiwiSGV0SGFuVGltZSI6IjE3MzM1Mjk2MDAwMDAiLCJuYmYiOjE3MTUxMDEyMDAsImV4cCI6MTczMzY3NzIwMH0.eRjDGZmIzPZGC0Mf03m9BN2p0gTqsUjw8zEfQtBd_bQ",
  };
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    const { url } = response.config;
    if (url?.includes("login")) {
      const { data } = response.data as SuccessResponse<LoginResponseType>;
      localStorage.setItem("user", JSON.stringify(data.info_user));
      localStorage.setItem("access_token", data.token.accessToken);
      localStorage.setItem("refresh_token", data.token.refreshToken);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 error
    console.log("check errior", error);
    if (error.response?.status === 401) {
      console.log("chuyển về login");
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      const navigate = useNavigate(); // Initialize navigate
      navigate("/login"); // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
