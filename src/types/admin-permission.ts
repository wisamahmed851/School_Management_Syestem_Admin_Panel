// Matches API_DOCUMENTATION.txt section 9 exactly

export interface AdminPermission {
  id: number;
  admin_id: number;
  permission_id: number;
  status: number;
}

export interface AdminPermissionListResponse {
  success: boolean;
  message: string;
  data: AdminPermission[];
}

export interface AdminPermissionResponse {
  success: boolean;
  message: string;
  data: AdminPermission;
}

export interface AdminPermissionToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface AdminPermissionDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads
export interface CreateAdminPermissionPayload {
  admin_id: number;
  permission_id: number;
}

export interface UpdateAdminPermissionPayload {
  admin_id?: number;
  permission_id?: number;
}
