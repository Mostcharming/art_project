/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

interface ApiMutationOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  isFormData?: boolean;
  baseURL?: string;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

interface ApiMutationError {
  message: string;
  status?: number;
  data?: any;
}

export function useApiMutation<T = any>(
  options: ApiMutationOptions
): UseMutationResult<ApiResponse<T>, ApiMutationError, any, unknown> & {
  isLoading: boolean;
} {
  const {
    endpoint,
    method = "POST",
    isFormData = false,
    baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: customHeaders = {},
  } = options;

  const mutation = useMutation<ApiResponse<T>, ApiMutationError, any>({
    mutationFn: async (payload: any) => {
      try {
        const axiosConfig: AxiosRequestConfig = {
          baseURL,
          method,
          url: endpoint,
          headers: {
            ...customHeaders,
          },
        };

        // Handle FormData
        if (isFormData && payload instanceof FormData) {
          axiosConfig.data = payload;
          axiosConfig.headers = {
            ...axiosConfig.headers,
            "Content-Type": "multipart/form-data",
          };
        } else if (method !== "GET" && method !== "DELETE") {
          axiosConfig.data = payload;
          axiosConfig.headers = {
            ...axiosConfig.headers,
            "Content-Type": "application/json",
          };
        } else if ((method === "GET" || method === "DELETE") && payload) {
          axiosConfig.params = payload;
        }

        const response = await axios(axiosConfig);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw {
          message:
            axiosError.response?.data?.message ||
            axiosError.message ||
            "An error occurred",
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        } as ApiMutationError;
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}

export type { ApiMutationError, ApiMutationOptions, ApiResponse };
