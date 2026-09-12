"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import type { CreateUserPayload, UpdateUserPayload } from "@/types/user";

const USERS_KEY = ["users"] as const;

export function useUsersList() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const res = await usersApi.list();
      return res.data;
    },
  });
}

export function useUser(id: number | string | undefined) {
  return useQuery({
    queryKey: ["users", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await usersApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateUserPayload;
    }) => usersApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      qc.invalidateQueries({ queryKey: ["users", id] });
    },
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => usersApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}
