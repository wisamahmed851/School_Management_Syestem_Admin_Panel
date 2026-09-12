// Matches API_DOCUMENTATION.txt section 5 exactly

export interface Permission {
  id: number;
  module: string;
  action: string;
  name: string;
  guard: string;
  status: number;
}

export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

export interface PermissionResponse {
  success: boolean;
  message: string;
  data: Permission;
}

export interface PermissionToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface PermissionDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads
export interface CreatePermissionPayload {
  module: string;
  action: string;
  name: string;
  guard: string;
}

export interface UpdatePermissionPayload {
  module?: string;
  action?: string;
  name?: string;
  guard?: string;
}
