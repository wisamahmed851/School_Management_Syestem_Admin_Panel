// Matches API_DOCUMENTATION.txt section 13 exactly

export interface SchoolClass {
  id: number;
  name: string;
  class_teacher_id: number | null;
  section: string | null;
  status: number;
}

export interface ClassListResponse {
  success: boolean;
  message: string;
  data: SchoolClass[];
}

export interface ClassResponse {
  success: boolean;
  message: string;
  data: SchoolClass;
}

export interface ClassToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface ClassDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateClassPayload {
  name: string;
  class_teacher_id?: number | null;
  section?: string;
}

export interface UpdateClassPayload {
  name?: string;
  class_teacher_id?: number | null;
  section?: string;
}
