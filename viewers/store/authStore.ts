import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Viewer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  vibePreference?: string;
}

export interface AuthState {
  user: Viewer | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: Viewer, token: string) => void;
  logout: () => void;
  restoreToken: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user: Viewer, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      restoreToken: async () => {
        // This is called on app startup to restore auth state from storage
        // Zustand will handle this automatically through persist middleware
      },
    }),
    {
      name: "viewer-auth-storage", // Storage key
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
