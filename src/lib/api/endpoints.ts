/**
 * Central registry of every API route used by the application.
 * All 133 routes are listed here, grouped by resource.
 * NEVER hardcode a URL string anywhere else — always import from this file.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────
export const AUTH = {
  LOGIN: "/admin/login",
  LOGOUT: "/admin/logout",
  ME: "/admin/me",
  REFRESH: "/admin/refresh",
} as const;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export const SIDEBAR = {
  GET: "/admin/sidebar",
} as const;

// ─── Admins ───────────────────────────────────────────────────────────────────
export const ADMINS = {
  LIST: "/admins",
  CREATE: "/admins",
  SHOW: (id: number | string) => `/admins/${id}`,
  UPDATE: (id: number | string) => `/admins/${id}`,
  DELETE: (id: number | string) => `/admins/${id}`,
  ASSIGN_ROLES: (id: number | string) => `/admins/${id}/roles`,
  REVOKE_ROLES: (id: number | string) => `/admins/${id}/roles`,
  PERMISSIONS: (id: number | string) => `/admins/${id}/permissions`,
} as const;

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  LIST: "/roles",
  CREATE: "/roles",
  SHOW: (id: number | string) => `/roles/${id}`,
  UPDATE: (id: number | string) => `/roles/${id}`,
  DELETE: (id: number | string) => `/roles/${id}`,
  ASSIGN_PERMISSIONS: (id: number | string) => `/roles/${id}/permissions`,
  REVOKE_PERMISSIONS: (id: number | string) => `/roles/${id}/permissions`,
  PERMISSIONS: (id: number | string) => `/roles/${id}/permissions`,
} as const;

// ─── Permissions ──────────────────────────────────────────────────────────────
export const PERMISSIONS = {
  LIST: "/permissions",
  CREATE: "/permissions",
  SHOW: (id: number | string) => `/permissions/${id}`,
  UPDATE: (id: number | string) => `/permissions/${id}`,
  DELETE: (id: number | string) => `/permissions/${id}`,
} as const;

// ─── Teachers ─────────────────────────────────────────────────────────────────
export const TEACHERS = {
  LIST: "/teachers",
  CREATE: "/teachers",
  SHOW: (id: number | string) => `/teachers/${id}`,
  UPDATE: (id: number | string) => `/teachers/${id}`,
  DELETE: (id: number | string) => `/teachers/${id}`,
  CLASSES: (id: number | string) => `/teachers/${id}/classes`,
  SUBJECTS: (id: number | string) => `/teachers/${id}/subjects`,
  SCHEDULE: (id: number | string) => `/teachers/${id}/schedule`,
} as const;

// ─── Guardians ────────────────────────────────────────────────────────────────
export const GUARDIANS = {
  LIST: "/guardians",
  CREATE: "/guardians",
  SHOW: (id: number | string) => `/guardians/${id}`,
  UPDATE: (id: number | string) => `/guardians/${id}`,
  DELETE: (id: number | string) => `/guardians/${id}`,
  STUDENTS: (id: number | string) => `/guardians/${id}/students`,
} as const;

// ─── Classes ──────────────────────────────────────────────────────────────────
export const CLASSES = {
  LIST: "/classes",
  CREATE: "/classes",
  SHOW: (id: number | string) => `/classes/${id}`,
  UPDATE: (id: number | string) => `/classes/${id}`,
  DELETE: (id: number | string) => `/classes/${id}`,
  STUDENTS: (id: number | string) => `/classes/${id}/students`,
  SUBJECTS: (id: number | string) => `/classes/${id}/subjects`,
  SCHEDULE: (id: number | string) => `/classes/${id}/schedule`,
} as const;

// ─── Students ─────────────────────────────────────────────────────────────────
export const STUDENTS = {
  LIST: "/students",
  CREATE: "/students",
  SHOW: (id: number | string) => `/students/${id}`,
  UPDATE: (id: number | string) => `/students/${id}`,
  DELETE: (id: number | string) => `/students/${id}`,
  GUARDIAN: (id: number | string) => `/students/${id}/guardian`,
  ATTENDANCE: (id: number | string) => `/students/${id}/attendance`,
  GRADES: (id: number | string) => `/students/${id}/grades`,
  SCHEDULE: (id: number | string) => `/students/${id}/schedule`,
} as const;

// ─── Subjects ─────────────────────────────────────────────────────────────────
export const SUBJECTS = {
  LIST: "/subjects",
  CREATE: "/subjects",
  SHOW: (id: number | string) => `/subjects/${id}`,
  UPDATE: (id: number | string) => `/subjects/${id}`,
  DELETE: (id: number | string) => `/subjects/${id}`,
} as const;

// ─── Class Subjects ───────────────────────────────────────────────────────────
export const CLASS_SUBJECTS = {
  LIST: "/class-subjects",
  CREATE: "/class-subjects",
  SHOW: (id: number | string) => `/class-subjects/${id}`,
  UPDATE: (id: number | string) => `/class-subjects/${id}`,
  DELETE: (id: number | string) => `/class-subjects/${id}`,
  BY_CLASS: (classId: number | string) => `/class-subjects/class/${classId}`,
  BY_SUBJECT: (subjectId: number | string) =>
    `/class-subjects/subject/${subjectId}`,
} as const;

// ─── Attendance ───────────────────────────────────────────────────────────────
export const ATTENDANCE = {
  LIST: "/attendance",
  CREATE: "/attendance",
  SHOW: (id: number | string) => `/attendance/${id}`,
  UPDATE: (id: number | string) => `/attendance/${id}`,
  DELETE: (id: number | string) => `/attendance/${id}`,
  BY_CLASS: (classId: number | string) => `/attendance/class/${classId}`,
  BY_STUDENT: (studentId: number | string) =>
    `/attendance/student/${studentId}`,
  REPORT: "/attendance/report",
  BULK_CREATE: "/attendance/bulk",
} as const;

// ─── Assignments ──────────────────────────────────────────────────────────────
export const ASSIGNMENTS = {
  LIST: "/assignments",
  CREATE: "/assignments",
  SHOW: (id: number | string) => `/assignments/${id}`,
  UPDATE: (id: number | string) => `/assignments/${id}`,
  DELETE: (id: number | string) => `/assignments/${id}`,
  SUBMIT: (id: number | string) => `/assignments/${id}/submit`,
  SUBMISSIONS: (id: number | string) => `/assignments/${id}/submissions`,
  GRADE: (id: number | string, submissionId: number | string) =>
    `/assignments/${id}/submissions/${submissionId}/grade`,
  BY_CLASS: (classId: number | string) => `/assignments/class/${classId}`,
  BY_SUBJECT: (subjectId: number | string) =>
    `/assignments/subject/${subjectId}`,
} as const;

// ─── Exams ────────────────────────────────────────────────────────────────────
export const EXAMS = {
  LIST: "/exams",
  CREATE: "/exams",
  SHOW: (id: number | string) => `/exams/${id}`,
  UPDATE: (id: number | string) => `/exams/${id}`,
  DELETE: (id: number | string) => `/exams/${id}`,
  RESULTS: (id: number | string) => `/exams/${id}/results`,
  SUBMIT_RESULT: (id: number | string) => `/exams/${id}/results`,
  UPDATE_RESULT: (id: number | string, resultId: number | string) =>
    `/exams/${id}/results/${resultId}`,
  DELETE_RESULT: (id: number | string, resultId: number | string) =>
    `/exams/${id}/results/${resultId}`,
  SCHEDULE: "/exams/schedule",
  BY_CLASS: (classId: number | string) => `/exams/class/${classId}`,
  BY_SUBJECT: (subjectId: number | string) => `/exams/subject/${subjectId}`,
} as const;
