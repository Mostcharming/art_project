import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useUserStore } from "../store";
import {
  useActivityLogStore,
  type ActivityLog,
} from "../store/activityLogStore";

const baseURL = import.meta.env.VITE_API_URL;

interface ApiResponse {
  success: boolean;
  data: ActivityLog[];
  message?: string;
}

export function useFetchActivityLogs() {
  const setLogs = useActivityLogStore((s) => s.setLogs);
  const setIsLoading = useActivityLogStore((s) => s.setIsLoading);
  const setError = useActivityLogStore((s) => s.setError);
  const user = useUserStore((s) => s.user);

  const query = useQuery<ApiResponse>({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/admins/activity-logs`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      return response.data;
    },
    enabled: !!user?.token,
  });

  useEffect(() => {
    setIsLoading(query.isLoading);
  }, [query.isLoading, setIsLoading]);

  useEffect(() => {
    if (query.isError) {
      setError(
        query.error instanceof Error
          ? query.error.message
          : "Failed to fetch activity logs"
      );
    } else {
      setError(null);
    }
  }, [query.isError, query.error, setError]);

  useEffect(() => {
    if (query.data?.success && query.data?.data) {
      setLogs(query.data.data);
    }
  }, [query.data, setLogs]);

  return query;
}
