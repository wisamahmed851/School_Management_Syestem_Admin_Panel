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

// ─── Profile — matches GET /admin/profile success data exactly ───────────────
export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: number;
  created_at: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: AdminProfile;
}

// ─── Change password ─────────────────────────────────────────────────────────
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// ─── Logout ──────────────────────────────────────────────────────────────────
export interface LogoutResponse {
  success: boolean;
  message: string;
}
