import { apiClient } from "./client";
import { ATTENDANCE } from "./endpoints";
import type {
  AttendanceByClassResponse,
  MarkAttendancePayload,
  MarkAttendanceResponse,
} from "@/types/attendance";

export const attendanceApi = {
  byClass: async (
    classId: number | string,
    date: string
  ): Promise<AttendanceByClassResponse> => {
    const res = await apiClient.get<AttendanceByClassResponse>(
      ATTENDANCE.BY_CLASS(classId),
      { params: { date } }
    );
    return res.data;
  },

  mark: async (payload: MarkAttendancePayload): Promise<MarkAttendanceResponse> => {
    const res = await apiClient.post<MarkAttendanceResponse>(
      ATTENDANCE.MARK,
      payload
    );
    return res.data;
  },
};
