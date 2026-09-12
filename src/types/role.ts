// Matches API_DOCUMENTATION.txt section 4 exactly

export interface Role {
  id: number;
  name: string;
  guard: string;
  status: number;
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: Role[];
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RoleToggleStatusResponse {
  success: boolean;
  message: string;
  data: { id: number; status: number };
}

export interface RoleDeleteResponse {
  success: boolean;
  message: string;
}

// Request payloads
export interface CreateRolePayload {
  name: string;
  guard: string;
}

export interface UpdateRolePayload {
  name?: string;
  guard?: string;
}
