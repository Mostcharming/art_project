import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Member {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateAdded: string;
  lastActive: string;
  roleId: number;
}

export interface RoleWithMembers {
  id: number;
  name: string;
  description: string;
  isDefault: boolean;
  isCustom: boolean;
  members: Member[];
}

interface MembersStore {
  roles: RoleWithMembers[];
  isLoading: boolean;
  error: string | null;
  setRoles: (roles: RoleWithMembers[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useMembersStore = create<MembersStore>()(
  persist(
    (set) => ({
      roles: [],
      isLoading: false,
      error: null,
      setRoles: (roles) => set({ roles }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "members-store",
    }
  )
);
