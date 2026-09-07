import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types/admin";

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,

      login: (token: string, admin: AdminUser) => {
        set({ token, admin, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, admin: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
