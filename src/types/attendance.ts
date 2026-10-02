// Matches the backend (attendance.service.ts) and API_DOCUMENTATION.txt section 15

export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  id: number;
  student_id: number;
  class_id: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  marked_by_id: number | null;
  marked_by_type: "admin" | "teacher";
  marked_by_name: string | null;
  student?: { id: number; name: string; roll_no: string };
}

export interface AttendanceByClassResponse {
  success: boolean;
  message: string;
  data: {
    class_id: number;
    class_name: string;
    date: string;
    total: number;
    records: AttendanceRecord[];
  };
}

export interface MarkAttendancePayload {
  class_id: number;
  date: string;
  records: { student_id: number; status: AttendanceStatus }[];
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
}
