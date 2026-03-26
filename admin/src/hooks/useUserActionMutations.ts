/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "../store";

const baseURL = import.meta.env.VITE_API_URL;

interface SuspendData {
  startDate: string;
  endDate: string;
  reason: string;
}

interface BanData {
  reason: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function useSuspendUserMutation() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, { userId: string; data: SuspendData }>(
    {
      mutationFn: async ({ userId, data }) => {
        const response = await axios.put(
          `${baseURL}/admins/users/${userId}/suspend`,
          {
            suspensionStartDate: data.startDate,
            suspensionEndDate: data.endDate,
            reasonForSuspension: data.reason,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        // Invalidate user details cache
        queryClient.invalidateQueries({ queryKey: ["user-details"] });
      },
    }
  );
}

export function useBanUserMutation() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, { userId: string; data: BanData }>({
    mutationFn: async ({ userId, data }) => {
      const response = await axios.put(
        `${baseURL}/admins/users/${userId}/ban`,
        {
          reasonForBan: data.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details"] });
    },
  });
}

export function useReactivateUserMutation() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, string>({
    mutationFn: async (userId) => {
      const response = await axios.put(
        `${baseURL}/admins/users/${userId}/reactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details"] });
    },
  });
}
