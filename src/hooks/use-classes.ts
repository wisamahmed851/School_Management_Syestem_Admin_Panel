"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesApi } from "@/lib/api/classes";
import type { CreateClassPayload, UpdateClassPayload } from "@/types/class";

const CLASSES_KEY = ["classes"] as const;

export function useClassesList() {
  return useQuery({
    queryKey: CLASSES_KEY,
    queryFn: async () => {
      const res = await classesApi.list();
      return res.data;
    },
  });
}

export function useClass(id: number | string | undefined) {
  return useQuery({
    queryKey: ["classes", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await classesApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassPayload) => classesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLASSES_KEY }),
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateClassPayload;
    }) => classesApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: CLASSES_KEY });
      qc.invalidateQueries({ queryKey: ["classes", id] });
    },
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => classesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLASSES_KEY }),
  });
}

export function useToggleClassStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => classesApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLASSES_KEY }),
  });
}
