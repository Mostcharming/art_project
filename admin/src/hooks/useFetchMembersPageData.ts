import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useUserStore } from "../store";
import { useMembersStore, type RoleWithMembers } from "../store/membersStore";

const baseURL = import.meta.env.VITE_API_URL;

interface ApiResponse {
  success: boolean;
  data: RoleWithMembers[];
  message?: string;
}

export function useFetchMembersPageData() {
  const setRoles = useMembersStore((s) => s.setRoles);
  const setIsLoading = useMembersStore((s) => s.setIsLoading);
  const setError = useMembersStore((s) => s.setError);
  const user = useUserStore((s) => s.user);

  const query = useQuery<ApiResponse>({
    queryKey: ["members-page-data"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/admins/members-page`, {
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
          : "Failed to fetch members data"
      );
    } else {
      setError(null);
    }
  }, [query.isError, query.error, setError]);

  useEffect(() => {
    if (query.data?.success && query.data?.data) {
      setRoles(query.data.data);
    }
  }, [query.data, setRoles]);

  return {
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}
