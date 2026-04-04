/**
 * API Helper functions for common API operations
 * These functions wrap the apiService for commonly used patterns
 */

import { ApiResponse, apiService } from "./apiService";

/**
 * Fetch data with automatic error handling and logging
 */
export async function fetchData<T = any>(
  endpoint: string,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiService.get<T>(endpoint, { token });

    if (response.error) {
      console.warn(`API Error (${endpoint}):`, response.error);
    }

    return response;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mutate data (POST, PUT, PATCH) with automatic error handling
 */
export async function mutateData<T = any>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH",
  payload: any,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiService.request<T>(endpoint, {
      method,
      payload,
      token,
    });

    if (response.error) {
      console.warn(`API Error (${method} ${endpoint}):`, response.error);
    }

    return response;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete data with automatic error handling
 */
export async function deleteData<T = any>(
  endpoint: string,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiService.delete<T>(endpoint, { token });

    if (response.error) {
      console.warn(`API Error (DELETE ${endpoint}):`, response.error);
    }

    return response;
  } catch (error) {
    console.error(`API Error (DELETE ${endpoint}):`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Retry API request with exponential backoff
 * Useful for handling transient network errors
 */
export async function retryRequest<T = any>(
  fn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<ApiResponse<T>> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fn();

      if (!response.error) {
        return response;
      }

      // Don't retry on 4xx errors (client errors)
      if (response.status && response.status >= 400 && response.status < 500) {
        return response;
      }
    } catch (error) {
      // Continue to retry
    }

    if (attempt < maxRetries - 1) {
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * Math.pow(2, attempt))
      );
    }
  }

  return {
    data: null,
    error: "Failed after maximum retries",
  };
}

/**
 * Batch fetch multiple endpoints
 */
export async function batchFetch<T = any>(
  endpoints: string[],
  token?: string
): Promise<ApiResponse<T[]>> {
  try {
    const responses = await Promise.all(
      endpoints.map((endpoint) => apiService.get<T>(endpoint, { token }))
    );

    // Check for any errors
    const errorResponse = responses.find((r) => r.error);
    if (errorResponse) {
      return {
        data: null,
        error: errorResponse.error,
      };
    }

    return {
      data: responses.map((r) => r.data).filter((d) => d !== null) as T[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Batch fetch failed",
    };
  }
}

/**
 * Upload file with progress tracking
 * Note: axios supports progress events, but this is a basic implementation
 */
export async function uploadFile<T = any>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await apiService.request<T>(endpoint, {
      method: "POST",
      payload: formData,
      dataType: "formdata",
      token,
    });

    return response;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Debounced API call (useful for search, auto-save, etc.)
 */
export function createDebouncedApiCall<T = any>(
  fn: () => Promise<ApiResponse<T>>,
  delayMs: number = 500
) {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastResult: ApiResponse<T> | null = null;

  return {
    call: (callback?: (response: ApiResponse<T>) => void) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        const result = await fn();
        lastResult = result;
        callback?.(result);
      }, delayMs);
    },

    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },

    getLastResult: () => lastResult,
  };
}

/**
 * Cache API response for a specified duration
 */
export function createCachedApiCall<T = any>(
  fn: () => Promise<ApiResponse<T>>,
  cacheTimeMs: number = 60000 // 1 minute default
) {
  let cachedData: ApiResponse<T> | null = null;
  let cacheTimestamp: number | null = null;

  return async (): Promise<ApiResponse<T>> => {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedData && cacheTimestamp && now - cacheTimestamp < cacheTimeMs) {
      return cachedData;
    }

    // Fetch new data
    const result = await fn();

    if (!result.error) {
      cachedData = result;
      cacheTimestamp = now;
    }

    return result;
  };
}
