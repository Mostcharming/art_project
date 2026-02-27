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
  setUser: (user: __UserData__) => void;
  clearUser: () => void;
}

export const useUserStore = create<__UserStore__>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store",
    }
  )
);
