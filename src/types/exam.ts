// Matches the backend (exam.service.ts)

export type ExamType = "midterm" | "final" | "quiz" | "unit_test";
export type ResultStatus = "pending" | "pass" | "fail" | "absent";

export const EXAM_TYPES: { value: ExamType; label: string }[] = [
  { value: "midterm", label: "Midterm" },
  { value: "final", label: "Final" },
  { value: "quiz", label: "Quiz" },
  { value: "unit_test", label: "Unit test" },
];

export interface Exam {
  id: number;
  title: string;
  exam_type: ExamType;
  exam_date: string;
  start_time: string | null;
  end_time: string | null;
  /** MySQL decimal: may arrive as a string */
  total_marks: string | number;
  class_id: number;
  class_name: string | null;
  subject_id: number | null;
  subject_name: string | null;
  status: number;
}

export interface ExamResult {
  id: number;
  student_id: number;
  marks_obtained: string | number | null;
  percentage: string | number | null;
  status: ResultStatus;
  remarks: string | null;
  student?: { id: number; name: string; roll_no: string };
}

export interface ExamDetail extends Exam {
  description: string | null;
  results_count: number;
  results: ExamResult[];
}

export interface ExamListResponse {
  success: boolean;
  message: string;
  data: Exam[];
}

export interface ExamResponse {
  success: boolean;
  message: string;
  data: ExamDetail;
}

export interface ExamResultResponse {
  success: boolean;
  message: string;
  data: ExamResult;
}

export interface ExamToggleStatusResponse {
  success: boolean;
  message: string;
}

export interface ExamDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateExamPayload {
  title: string;
  exam_type: ExamType;
  class_id: number;
  subject_id?: number;
  exam_date: string;
  start_time?: string;
  end_time?: string;
  total_marks: number;
  description?: string;
}

/** class_id is locked after creation and therefore not updatable */
export type UpdateExamPayload = Partial<Omit<CreateExamPayload, "class_id">>;

/** Pass/fail is derived by the server from marks_obtained; only "absent" and "pending" can be sent. */
export interface UpdateResultPayload {
  marks_obtained?: number;
  status?: "absent" | "pending";
  remarks?: string;
}
