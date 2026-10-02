"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "@/lib/api/students";
import type { CreateStudentPayload, UpdateStudentPayload } from "@/types/student";

const STUDENTS_KEY = ["students"] as const;

export function useStudentsList() {
  return useQuery({
    queryKey: STUDENTS_KEY,
    queryFn: async () => {
      const res = await studentsApi.list();
      return res.data;
    },
  });
}

export function useStudent(id: number | string | undefined) {
  return useQuery({
    queryKey: ["students", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await studentsApi.show(id!);
      return res.data;
    },
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => studentsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: STUDENTS_KEY }),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateStudentPayload;
    }) => studentsApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
      qc.invalidateQueries({ queryKey: ["students", id] });
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => studentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: STUDENTS_KEY }),
  });
}

export function useToggleStudentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => studentsApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: STUDENTS_KEY }),
  });
}
