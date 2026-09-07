// Matches POST /admin/login response shape exactly

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponseData {
  access_token: string;
  admin: AdminUser;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string | ValidationError[];
}
