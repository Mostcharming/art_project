import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface __UserData__ {
  token: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

interface __UserStore__ {
  user: __UserData__ | null;
  adminEmail: string | null;
  rememberEmail: string | null;
  setUser: (user: __UserData__) => void;
  setAdminEmail: (email: string | null) => void;
  setRememberEmail: (email: string | null) => void;
  clearUser: () => void;
  clearSession: () => void;
}

export const useUserStore = create<__UserStore__>()(
  persist(
    (set) => ({
      user: null,
      adminEmail: null,
      rememberEmail: null,
      setUser: (user) => set({ user }),
      setAdminEmail: (email) => set({ adminEmail: email }),
      setRememberEmail: (email) => set({ rememberEmail: email }),
      clearUser: () => set({ user: null }),
      clearSession: () => set({ adminEmail: null, user: null }),
    }),
    {
      name: "user-store",
    }
  )
);
