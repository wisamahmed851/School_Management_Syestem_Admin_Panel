"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type { ChangePasswordPayload } from "@/types/admin";

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authApi.changePassword(payload),
  });
}
