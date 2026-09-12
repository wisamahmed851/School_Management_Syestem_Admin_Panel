// Admin resource — matches API_DOCUMENTATION.txt section 2 exactly
// Named AdminRecord to avoid collision with AdminUser (auth) in types/admin.ts

export interface AdminRecord {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: number;
  created_at: string;
}

export interface AdminListResponse {
  success: boolean;
  message: string;
  data: AdminRecord[];
}

export interface AdminResourceResponse {
  success: boolean;
  message: string;
  data: AdminRecord;
}

export interface AdminToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface AdminDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads — multipart/form-data (sent as FormData)
export interface CreateAdminPayload {
  name?: string;
  email: string;
  password: string;
  image?: File | null;
  role_id?: number;
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  password?: string;
  image?: File | null;
}
