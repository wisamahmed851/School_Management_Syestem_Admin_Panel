// Matches API_DOCUMENTATION.txt section 11 exactly

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject_specialization: string | null;
  joining_date: string | null;
  status: number;
}

export interface TeacherListResponse {
  success: boolean;
  message: string;
  data: Teacher[];
}

export interface TeacherResponse {
  success: boolean;
  message: string;
  data: Teacher;
}

export interface TeacherToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface TeacherDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateTeacherPayload {
  name: string;
  email: string;
  phone?: string;
  subject_specialization?: string;
  joining_date?: string;
  password: string;
}

export interface UpdateTeacherPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject_specialization?: string;
  joining_date?: string;
}
