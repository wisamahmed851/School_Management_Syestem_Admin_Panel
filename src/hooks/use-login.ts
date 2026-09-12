"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authApi, type LoginPayload } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/auth/auth-store";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      const { access_token, admin } = data.data;
      console.log(access_token);
      // Persist token in cookie (accessible by proxy.ts for SSR redirect)
      Cookies.set("access_token", access_token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Persist admin + auhttp://localhost:3000th state in zustand store
      login(access_token, admin);

      router.push("/dashboard");
    },
  });
}
