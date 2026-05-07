import { getBaseUrl } from "@/constants/api.config";
import { useUserStore } from "@/store/userStore";
import axios, { isAxiosError } from "axios";
import { useState } from "react";

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type DataType = "json" | "formdata";

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface RequestOptions {
  method?: ApiMethod;
  dataType?: DataType;
  headers?: Record<string, string>;
  payload?: any;
}

export const useApiMutate = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = useUserStore((state) => state.token);

  const mutate = async (
    subUrl: string,
    options: RequestOptions
  ): Promise<ApiResponse> => {
    const {
      method = "GET",
      dataType = "json",
      headers = {},
      payload,
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}${subUrl}`;

      const requestHeaders: Record<string, string> = {
        ...headers,
      };

      // Add authorization token
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const axiosConfig: any = {
        method,
        url,
        // timeout: 30000,
        headers: requestHeaders,
      };
      console.log("API Request Config:", {
        method,
        url,
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

      setData(response.data);
      setIsLoading(false);

      return {
        data: response.data,
        error: null,
        isLoading: false,
      };
    } catch (err) {
      let errorMessage = "An unknown error occurred";

      if (isAxiosError(err)) {
        console.error("Axios error details:", {
          message: err.message,
        });

        if (err.response) {
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

      setError(errorMessage);
      setIsLoading(false);

      return {
        data: null,
        error: errorMessage,
        isLoading: false,
      };
    }
  };

  return {
    mutate,
    data,
    error,
    isLoading,
  };
};
