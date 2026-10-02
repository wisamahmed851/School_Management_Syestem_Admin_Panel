// Matches the backend (class-subject.service.ts) and API_DOCUMENTATION.txt section 16

export interface ClassSubject {
  id: number;
  class_id: number;
  subject_id: number;
  teacher_id: number | null;
}

/** Item of GET /admin/class-subjects/class/:class_id */
export interface ClassSubjectByClassItem extends ClassSubject {
  subject_name: string | null;
  subject_code: string | null;
  teacher_name: string | null;
  status: number;
}

/** Item of GET /admin/class-subjects/teacher/:teacher_id */
export interface ClassSubjectByTeacherItem {
  id: number;
  class_id: number;
  class_name: string | null;
  subject_id: number;
  subject_name: string | null;
  subject_code: string | null;
  status: number;
}

export interface ClassSubjectsByClassResponse {
  success: boolean;
  message: string;
  data: {
    class_id: number;
    class_name: string;
    subjects: ClassSubjectByClassItem[];
  };
}

export interface ClassSubjectsByTeacherResponse {
  success: boolean;
  message: string;
  data: {
    teacher_id: number;
    teacher_name: string;
    assignments: ClassSubjectByTeacherItem[];
  };
}

export interface ClassSubjectResponse {
  success: boolean;
  message: string;
  data: ClassSubject;
}

export interface ClassSubjectDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateClassSubjectPayload {
  class_id: number;
  subject_id: number;
  teacher_id?: number | null;
}

export interface UpdateClassSubjectPayload {
  teacher_id?: number | null;
}
