import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface ActivityLog {
  id: number;
  adminId: number;
  action: string;
  entityType?: string;
  entityId?: number;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failed" | "pending";
  createdAt: string;
  admin: AdminUser;
}

interface ActivityLogStore {
  logs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  setLogs: (logs: ActivityLog[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useActivityLogStore = create<ActivityLogStore>()(
  persist(
    (set) => ({
      logs: [],
      isLoading: false,
      error: null,
      setLogs: (logs) => set({ logs }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "activity-log-store",
    }
  )
);
