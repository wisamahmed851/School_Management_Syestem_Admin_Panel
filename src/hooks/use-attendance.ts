"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/lib/api/attendance";
import type { MarkAttendancePayload } from "@/types/attendance";

export function useAttendanceByClass(
  classId: number | string | undefined,
  date: string
) {
  return useQuery({
    queryKey: ["attendance", "class", classId, date],
    enabled: !!classId && !!date,
    queryFn: async () => {
      const res = await attendanceApi.byClass(classId!, date);
      return res.data;
    },
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MarkAttendancePayload) => attendanceApi.mark(payload),
    onSuccess: (_d, p) => {
      qc.invalidateQueries({
        queryKey: ["attendance", "class", String(p.class_id), p.date],
      });
    },
  });
}
