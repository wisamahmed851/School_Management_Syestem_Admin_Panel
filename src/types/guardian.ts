// Matches API_DOCUMENTATION.txt section 12 exactly

export interface Guardian {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  relation_to_student: string | null;
  status?: number;
}

export interface GuardianListResponse {
  success: boolean;
  message: string;
  data: Guardian[];
}

export interface GuardianResponse {
  success: boolean;
  message: string;
  data: Guardian;
}

export interface GuardianDeleteResponse {
  success: boolean;
  message: string;
}

export interface CreateGuardianPayload {
  name: string;
  phone?: string;
  email?: string;
  relation_to_student?: string;
  password: string;
}

export interface UpdateGuardianPayload {
  name?: string;
  phone?: string;
  email?: string;
  relation_to_student?: string;
}
