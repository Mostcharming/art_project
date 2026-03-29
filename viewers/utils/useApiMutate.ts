import axios, { isAxiosError } from 'axios';
import { useState } from 'react';
import { getBaseUrl } from '../constants/api.config';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type DataType = 'json' | 'formdata';

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
  token?: string;
}

// Non-hook version for use in stores and non-component contexts
export const apiMutate = async (
  subUrl: string,
  options: RequestOptions,
): Promise<ApiResponse> => {
  const {
    method = 'GET',
    dataType = 'json',
    headers = {},
    payload,
    token,
  } = options;

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
      timeout: 30000,
      headers: requestHeaders,
    };

    console.log('API Request Config:', {
      method,
      url,
      headers: requestHeaders,
      payload,
    });

    // Attach payload for POST/PUT/PATCH
    if (
      payload &&
      (method === 'POST' || method === 'PUT' || method === 'PATCH')
    ) {
      if (dataType === 'json') {
        requestHeaders['Content-Type'] = 'application/json';
        axiosConfig.data = payload;
      }

      if (dataType === 'formdata') {
        requestHeaders['Content-Type'] = 'multipart/form-data';
        axiosConfig.data = payload;
      }
    }

    const response = await axios(axiosConfig);

    return {
      data: response.data,
      error: null,
      isLoading: false,
    };
  } catch (err: any) {
    let errorMessage = 'An unknown error occurred';

    if (isAxiosError(err)) {
      console.error('Axios error details:', {
        message: err.message,
      });

      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Check if backend is running.';
      } else {
        errorMessage = err.message;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      data: null,
      error: errorMessage,
      isLoading: false,
    };
  }
};

// Hook version for use in React components
export const useApiMutate = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    subUrl: string,
    options: Omit<RequestOptions, 'token'>,
  ): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    const response = await apiMutate(subUrl, options);

    if (response.error) {
      setError(response.error);
    } else {
      setData(response.data);
    }

    setIsLoading(false);

    return response;
  };

  return {
    mutate,
    data,
    error,
    isLoading,
  };
};
