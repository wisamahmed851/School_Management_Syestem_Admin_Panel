import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types/admin";

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  /** Flat permissions list from GET /admin/sidebar — e.g. "students.create" */
  permissions: string[];
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
  setPermissions: (permissions: string[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      permissions: [],

      login: (token: string, admin: AdminUser) => {
        set({ token, admin, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, admin: null, isAuthenticated: false, permissions: [] });
      },

      setPermissions: (permissions: string[]) => {
        set({ permissions });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
