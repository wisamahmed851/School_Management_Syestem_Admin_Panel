// Matches API_DOCUMENTATION.txt section 8 exactly

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  status: number;
}

export interface UserRoleListResponse {
  success: boolean;
  message: string;
  data: UserRole[];
}

export interface UserRoleResponse {
  success: boolean;
  message: string;
  data: UserRole;
}

export interface UserRoleToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface UserRoleDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads
export interface CreateUserRolePayload {
  user_id: number;
  role_id: number;
}

export interface UpdateUserRolePayload {
  user_id?: number;
  role_id?: number;
}
