import { getBaseUrl } from "@/constants/api.config";
import axios, { AxiosRequestConfig, isAxiosError } from "axios";

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type DataType = "json" | "formdata";

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status?: number;
}

interface RequestOptions {
  method?: ApiMethod;
  dataType?: DataType;
  headers?: Record<string, string>;
  payload?: any;
  token?: string;
}

/**
 * API Service for making HTTP requests
 * Uses axios and supports both development (192.168.1.147) and production URLs
 */
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  /**
   * Make an API request
   * @param subUrl - The endpoint path (e.g., '/carousels', '/publishers')
   * @param options - Request options including method, payload, headers, etc.
   * @returns Promise with response data or error
   */
  async request<T = any>(
    subUrl: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      dataType = "json",
      headers = {},
      payload,
      token,
    } = options;

    try {
      const url = `${this.baseUrl}${subUrl}`;

      const requestHeaders: Record<string, string> = {
        ...headers,
      };

      // Add authorization token if provided
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        headers: requestHeaders,
      };
      console.log(`Making ${method} request to ${url} with options:`, {
        headers: requestHeaders,
        payload,
      });

      // Attach payload for POST/PUT/PATCH
      if (
        payload &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        if (dataType === "json") {
          requestHeaders["Content-Type"] = "application/json";
          axiosConfig.data = payload;
        }

        if (dataType === "formdata") {
          requestHeaders["Content-Type"] = "multipart/form-data";
          axiosConfig.data = payload;
        }
      }

      const response = await axios(axiosConfig);

      return {
        data: response.data as T,
        error: null,
        status: response.status,
      };
    } catch (err) {
      let errorMessage = "An unknown error occurred";
      let status = 500;

      if (isAxiosError(err)) {
        console.error("Axios error details:", {
          message: err.message,
          response: err.response?.data,
        });

        if (err.response) {
          status = err.response.status;
          errorMessage =
            err.response.data?.message ||
            err.response.data?.error ||
            `Error: ${err.response.status} ${err.response.statusText}`;
        } else if (err.request) {
          errorMessage =
            "No response from server. Check if backend is running.";
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      return {
        data: null,
        error: errorMessage,
        status,
      };
    }
  }

  /**
   * Make a GET request
   */
  async get<T = any>(
    subUrl: string,
    options?: Omit<RequestOptions, "method" | "payload">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(subUrl, { ...options, method: "GET" });
  }

  /**
   * Make a POST request
   */
  async post<T = any>(
    subUrl: string,
    payload: any,
    options?: Omit<RequestOptions, "method" | "payload">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(subUrl, { ...options, method: "POST", payload });
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(
    subUrl: string,
    payload: any,
    options?: Omit<RequestOptions, "method" | "payload">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(subUrl, { ...options, method: "PUT", payload });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(
    subUrl: string,
    payload: any,
    options?: Omit<RequestOptions, "method" | "payload">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(subUrl, { ...options, method: "PATCH", payload });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(
    subUrl: string,
    options?: Omit<RequestOptions, "method" | "payload">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(subUrl, { ...options, method: "DELETE" });
  }
}

// Export singleton instance
export const apiService = new ApiService();
