"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authApi, type LoginPayload } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/auth/auth-store";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      const { access_token, admin } = data.data;
      // Persist token in cookie (accessible by proxy.ts for SSR redirect)
      Cookies.set("access_token", access_token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Persist admin + auth state in zustand store
      login(admin);

      // Never show the previous admin's cached data (sidebar, profile, lists)
      queryClient.clear();

      router.push("/dashboard");
    },
  });
}
