// Matches the backend (assignment.service.ts) and API_DOCUMENTATION.txt (assignments section)

export type SubmissionStatus = "pending" | "submitted" | "late" | "graded";

export interface Assignment {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  class_id: number;
  class_name: string | null;
  subject_id: number | null;
  subject_name: string | null;
  teacher_id: number | null;
  teacher_name: string | null;
}

export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  submitted_at: string | null;
  status: SubmissionStatus;
  /** MySQL decimal: arrives as a string such as "85.00" */
  marks_obtained: string | number | null;
  feedback: string | null;
  student?: { id: number; name: string; roll_no: string };
}

export interface AssignmentDetail extends Omit<Assignment, "subject_name"> {
  subject: { id: number; name: string; code: string } | null;
  submissions_count: number;
  submissions: Submission[];
}

export interface AssignmentListResponse {
  success: boolean;
  message: string;
  data: Assignment[];
}

export interface AssignmentResponse {
  success: boolean;
  message: string;
  data: AssignmentDetail;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data: Submission;
}

export interface AssignmentDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateAssignmentPayload {
  class_id: number;
  subject_id?: number;
  title: string;
  description?: string;
  due_date: string;
}

/** class_id is locked after creation and therefore not updatable */
export interface UpdateAssignmentPayload {
  subject_id?: number;
  title?: string;
  description?: string;
  due_date?: string;
}

export interface UpdateSubmissionPayload {
  status?: SubmissionStatus;
  marks_obtained?: number;
  feedback?: string;
}
