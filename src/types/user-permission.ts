// Matches API_DOCUMENTATION.txt section 10 exactly

export interface UserPermission {
  id: number;
  user_id: number;
  permission_id: number;
  status: number;
}

export interface UserPermissionListResponse {
  success: boolean;
  message: string;
  data: UserPermission[];
}

export interface UserPermissionResponse {
  success: boolean;
  message: string;
  data: UserPermission;
}

export interface UserPermissionToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface UserPermissionDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads
export interface CreateUserPermissionPayload {
  user_id: number;
  permission_id: number;
}

export interface UpdateUserPermissionPayload {
  user_id?: number;
  permission_id?: number;
}
