// Matches API_DOCUMENTATION.txt section 15 exactly

export interface Subject {
  id: number;
  name: string;
  code: string;
  status: number;
}

export interface SubjectListResponse {
  success: boolean;
  message: string;
  data: Subject[];
}

export interface SubjectResponse {
  success: boolean;
  message: string;
  data: Subject;
}

export interface SubjectToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface SubjectDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateSubjectPayload {
  name: string;
  code: string;
}

export interface UpdateSubjectPayload {
  name?: string;
  code?: string;
}
