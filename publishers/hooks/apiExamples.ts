/**
 * Example usage of the useApiMutate hook
 *
 * This file demonstrates various ways to use the API middleware for different types of requests
 */

import { useApiMutate } from "@/hooks/useApiMutate";

// Example 1: Simple GET request
export const useGetUser = (userId: string, token?: string) => {
  const { mutate, data, error, isLoading } = useApiMutate();

  const getUser = async () => {
    return await mutate(`/users/${userId}`, {
      method: "GET",
      token,
    });
  };

  return { getUser, data, error, isLoading };
};

// Example 2: POST with JSON payload
export const useLoginUser = () => {
  const { mutate, data, error, isLoading } = useApiMutate();

  const login = async (email: string, password: string) => {
    return await mutate("/auth/login", {
      method: "POST",
      dataType: "json",
      payload: { email, password },
    });
  };

  return { login, data, error, isLoading };
};

// Example 3: POST with FormData (file upload)
export const useUploadFile = () => {
  const { mutate, data, error, isLoading } = useApiMutate();

  const uploadFile = async (file: File, token?: string) => {
    const formData = new FormData();
    formData.append("file", file);

    return await mutate("/upload", {
      method: "POST",
      dataType: "formdata",
      payload: formData,
      token,
    });
  };

  return { uploadFile, data, error, isLoading };
};

// Example 4: PUT request to update data
export const useUpdateUser = () => {
  const { mutate, data, error, isLoading } = useApiMutate();

  const updateUser = async (
    userId: string,
    updates: Record<string, any>,
    token?: string
  ) => {
    return await mutate(`/users/${userId}`, {
      method: "PUT",
      dataType: "json",
      payload: updates,
      token,
    });
  };

  return { updateUser, data, error, isLoading };
};

// Example 5: DELETE request
export const useDeleteUser = () => {
  const { mutate, data, error, isLoading } = useApiMutate();

  const deleteUser = async (userId: string, token?: string) => {
    return await mutate(`/users/${userId}`, {
      method: "DELETE",
      token,
    });
  };

  return { deleteUser, data, error, isLoading };
};
