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
}

export const useApiMutate = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useUserStore((state) => state.token);

  const mutate = async (
    subUrl: string,
    options: RequestOptions & { payload?: any }
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
      console.log(url);
      const requestHeaders: Record<string, string> = {
        ...headers,
      };

      // Add authorization token if provided
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      let data: any = undefined;

      if (
        payload &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        if (dataType === "json") {
          requestHeaders["Content-Type"] = "application/json";
          data = payload;
        } else if (dataType === "formdata") {
          data = payload;
        }
      }

      console.log("API Request:", {
        url,
        method,
        headers: requestHeaders,
        data,
      });

      const response = await axios({
        method: method as any,
        url,
        headers: requestHeaders,
        data,
        timeout: 30000,
      });

      setData(response.data);
      setIsLoading(false);

      return {
        data: response.data,
        error: null,
        isLoading: false,
      };
    } catch (err) {
      let errorMessage = "An unknown error occurred";
      let details = {};

      if (isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            err.response.data?.error ||
            `Error: ${err.response.status} ${err.response.statusText}`;
          details = {
            status: err.response.status,
            data: err.response.data,
          };
        } else if (err.request) {
          errorMessage =
            "No response from server. Check if backend is running.";
          details = { request: err.request };
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("API Error:", { errorMessage, details });

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
