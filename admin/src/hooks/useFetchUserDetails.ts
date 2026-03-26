import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "../store";

const baseURL = import.meta.env.VITE_API_URL;

export interface UserDetails {
  id: number;
  userId: string;
  name: string;
  email: string;
  type: "Publisher" | "Viewer";
  category: string;
  accountStatus: "Active" | "Suspended" | "Banned";
  avatarUrl: string | null;
  bio?: string;
  region: string;
  dateJoined: string;
  website?: string;
  carousels?: number;
  projects?: Array<{
    id: string;
    title: string;
    imageUrl: string | null;
    views: string;
  }>;
  interests?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  suspensionReasons: string[];
  suspensionStartDate?: string;
  suspensionEndDate?: string;
  reasonForBan?: string;
}

interface ApiResponse {
  success: boolean;
  data: UserDetails;
  message?: string;
}

export function useFetchUserDetails(userId: string | undefined) {
  const user = useUserStore((s) => s.user);

  const query = useQuery<ApiResponse>({
    queryKey: ["user-details", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await axios.get(`${baseURL}/admins/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      return response.data;
    },
    enabled: !!user?.token && !!userId,
  });

  return {
    userDetails: query.data?.data,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    isError: query.isError,
  };
}
