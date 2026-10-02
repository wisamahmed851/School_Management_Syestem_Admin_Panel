"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/auth/auth-store";

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  const clearAndRedirect = () => {
    // Always clear local state and redirect, regardless of API outcome.
    // A stuck session is worse than an orphaned server-side token.
    Cookies.remove("access_token");
    logout();
    queryClient.clear();
    router.push("/login");
  };

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: clearAndRedirect,
    onError: clearAndRedirect,
  });
}
