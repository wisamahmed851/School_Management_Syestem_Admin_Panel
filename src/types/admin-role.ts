// Matches API_DOCUMENTATION.txt section 7 exactly

export interface AdminRole {
  id: number;
  admin_id: number;
  role_id: number;
  status: number;
}

export interface AdminRoleListResponse {
  success: boolean;
  message: string;
  data: AdminRole[];
}

export interface AdminRoleResponse {
  success: boolean;
  message: string;
  data: AdminRole;
}

export interface AdminRoleToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface AdminRoleDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads
export interface CreateAdminRolePayload {
  admin_id: number;
  role_id: number;
}

export interface UpdateAdminRolePayload {
  admin_id?: number;
  role_id?: number;
}
