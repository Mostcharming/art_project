import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id?: string;
  email: string;
  password?: string;
  verificationToken?: string;
  verificationTokenExpires?: string;
  isEmailVerified: boolean;
  accountSetupComplete: boolean;
  personaType?: string;
  name?: string;
  country?: string;
  bio?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: (user: User) => set({ user }),

      setToken: (token: string) => set({ token }),

      updateUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearUser: () =>
        set({
          user: null,
          token: null,
        }),

      isAuthenticated: () => {
        const { user, token } = get();
        return !!user && !!token && user.isEmailVerified;
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
