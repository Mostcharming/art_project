import { getBaseUrl } from "@/constants/api.config";
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
  token?: string;
}

/**
 * useApiMutate Hook
 * Provides a mutate function for API calls with automatic state management
 *
 * @example
 * const { mutate, data, error, isLoading } = useApiMutate();
 *
 * // JSON request
 * await mutate("/auth/login", {
 *   method: "POST",
 *   dataType: "json",
 *   payload: { email: "user@example.com", password: "123456" }
 * });
 *
 * // FormData request
 * const formData = new FormData();
 * formData.append("file", file);
 * await mutate("/upload", {
 *   method: "POST",
 *   dataType: "formdata",
 *   payload: formData
 * });
 */
export const useApiMutate = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    subUrl: string,
    options: RequestOptions & { payload?: any }
  ): Promise<ApiResponse> => {
    const {
      method = "GET",
      dataType = "json",
      headers = {},
      token,
      payload,
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}${subUrl}`;

      // Prepare headers
      const requestHeaders: Record<string, string> = {
        ...headers,
      };

      // Add authorization token if provided
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      // Prepare body
      let body: string | FormData | undefined;

      if (
        payload &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        if (dataType === "json") {
          requestHeaders["Content-Type"] = "application/json";
          body = JSON.stringify(payload);
        } else if (dataType === "formdata") {
          // Don't set Content-Type for FormData - browser will set it with boundary
          body = payload; // payload should be FormData
        }
      }

      // Make the request
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body,
      });

      // Handle response
      if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the default error message
        }

        setError(errorMessage);
        setIsLoading(false);

        return {
          data: null,
          error: errorMessage,
          isLoading: false,
        };
      }

      // Parse response
      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setData(responseData);
      setIsLoading(false);

      return {
        data: responseData,
        error: null,
        isLoading: false,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";

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
