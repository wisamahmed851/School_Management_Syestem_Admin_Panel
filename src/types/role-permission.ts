// Matches API_DOCUMENTATION.txt section 6 exactly

export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  status: number;
}

export interface RolePermissionListResponse {
  success: boolean;
  message: string;
  data: RolePermission[];
}

export interface RolePermissionResponse {
  success: boolean;
  message: string;
  data: RolePermission;
}

export interface RolePermissionToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface RolePermissionDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads
export interface CreateRolePermissionPayload {
  role_id: number;
  permission_id: number;
}

export interface UpdateRolePermissionPayload {
  role_id?: number;
  permission_id?: number;
}
