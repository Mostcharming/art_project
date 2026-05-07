import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  vibePreference?: number;
  appUsage?: string;
  isVerified: boolean;
  emailVerifiedAt?: string;
  setupCompleted: boolean;
  status: "active" | "suspended" | "banned";
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStore {
  user: User | null;
  token: string | null;
  loginUser: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      loginUser: (user: User, token: string) => set({ user, token }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),

      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      isAuthenticated: () => {
        const { user, token } = get();
        return (
          !!user &&
          !!token &&
          user.isVerified &&
          user.setupCompleted &&
          user.status === "active"
        );
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
