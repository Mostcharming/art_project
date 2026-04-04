import { useUserStore } from "@/store/userStore";
import { apiService } from "@/utils/apiService";
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

/**
 * React hook for making API mutations
 * Wraps the apiService with React state management
 * Automatically includes auth token from user store
 */
export const useApiMutate = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = useUserStore((state) => state.token);

  const mutate = async (
    subUrl: string,
    options: RequestOptions = {}
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
      const response = await apiService.request(subUrl, {
        method,
        dataType,
        headers,
        payload,
        token: token || undefined,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setData(response.data);
      setIsLoading(false);

      return {
        data: response.data,
        error: null,
        isLoading: false,
      };
    } catch (err) {
      let errorMessage = "An unknown error occurred";

      if (err instanceof Error) {
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
