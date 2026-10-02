"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classSubjectsApi } from "@/lib/api/class-subjects";
import type {
  CreateClassSubjectPayload,
  UpdateClassSubjectPayload,
} from "@/types/class-subject";

export function useClassSubjectsByClass(classId: number | string | undefined) {
  return useQuery({
    queryKey: ["class-subjects", "class", classId],
    enabled: !!classId,
    queryFn: async () => {
      const res = await classSubjectsApi.byClass(classId!);
      return res.data.subjects;
    },
  });
}

export function useClassSubjectsByTeacher(teacherId: number | string | undefined) {
  return useQuery({
    queryKey: ["class-subjects", "teacher", teacherId],
    enabled: !!teacherId,
    queryFn: async () => {
      const res = await classSubjectsApi.byTeacher(teacherId!);
      return res.data.assignments;
    },
  });
}

export function useCreateClassSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassSubjectPayload) =>
      classSubjectsApi.create(payload),
    onSuccess: (_data, payload) => {
      qc.invalidateQueries({
        queryKey: ["class-subjects", "class", payload.class_id],
      });
    },
  });
}

export function useUpdateClassSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      classId: number | string;
      payload: UpdateClassSubjectPayload;
    }) => classSubjectsApi.update(id, payload),
    onSuccess: (_data, { classId }) => {
      qc.invalidateQueries({
        queryKey: ["class-subjects", "class", classId],
      });
    },
  });
}

export function useDeleteClassSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number | string; classId: number | string }) =>
      classSubjectsApi.remove(id),
    onSuccess: (_data, { classId }) => {
      qc.invalidateQueries({
        queryKey: ["class-subjects", "class", classId],
      });
    },
  });
}
