import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types/admin";

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  /** Flat permissions list from GET /admin/sidebar — e.g. "students.create" */
  permissions: string[];
  login: (admin: AdminUser) => void;
  logout: () => void;
  setPermissions: (permissions: string[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      permissions: [],

      login: (admin: AdminUser) => {
        set({ admin, isAuthenticated: true });
      },

      logout: () => {
        set({ admin: null, isAuthenticated: false, permissions: [] });
      },

      setPermissions: (permissions: string[]) => {
        set({ permissions });
      },
    }),
    {
      name: "auth-storage",
      // The access token lives only in the cookie; never persist it in localStorage.
      partialize: (s) => ({ admin: s.admin, isAuthenticated: s.isAuthenticated }),
    }
  )
);
