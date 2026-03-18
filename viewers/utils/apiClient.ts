import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token expiry
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - logout user
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    try {
      const response = await this.client.post("/viewers/auth/login", {
        email,
        password,
      });

      const { token, viewer } = response.data;
      useAuthStore.getState().login(viewer, token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.client.post("/viewers/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      useAuthStore.getState().logout();
    }
  }

  async verifyToken() {
    try {
      const response = await this.client.get("/viewers/auth/verify");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
