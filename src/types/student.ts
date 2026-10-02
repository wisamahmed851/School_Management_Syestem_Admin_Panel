// Matches API_DOCUMENTATION.txt section 14 plus class_name/guardian_name returned by the backend

export interface Student {
  id: number;
  name: string;
  roll_no: string;
  dob: string | null;
  gender: string | null;
  identity_number: string | null;
  class_id: number;
  guardian_id: number;
  admission_date: string | null;
  status: number;
  /** Added by the backend on list/detail responses */
  class_name?: string | null;
  guardian_name?: string | null;
}

export interface StudentListResponse {
  success: boolean;
  message: string;
  data: Student[];
}

export interface StudentResponse {
  success: boolean;
  message: string;
  data: Student;
}

export interface StudentToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface StudentDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateStudentPayload {
  name: string;
  roll_no: string;
  dob?: string;
  gender?: string;
  identity_number?: string;
  class_id: number;
  guardian_id: number;
  admission_date?: string;
}

export interface UpdateStudentPayload {
  name?: string;
  roll_no?: string;
  dob?: string;
  gender?: string;
  identity_number?: string;
  class_id?: number;
  guardian_id?: number;
  admission_date?: string;
}
