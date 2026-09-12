/**
 * Central registry of every API route used by the application.
 * NEVER hardcode a URL string anywhere else — always import from this file.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────
export const AUTH = {
  LOGIN: "/admin/login",
  PROFILE: "/admin/profile",
  CHANGE_PASSWORD: "/admin/change-password",
  LOGOUT: "/admin/logout",
  ME: "/admin/me",
  REFRESH: "/admin/refresh",
} as const;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export const SIDEBAR = {
  GET: "/admin/me/menu",
} as const;

// ─── Admins ───────────────────────────────────────────────────────────────────
// Base path: /admin  (Controller: AdminsController, section 2)
export const ADMINS = {
  STORE: "/admin/store",
  INDEX: "/admin/index",
  ACTIVE: "/admin/active",
  SHOW: (id: number | string) => `/admin/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/update/${id}`,
  REMOVE: (id: number | string) => `/admin/remove/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/toggleStatus/${id}`,
} as const;

// ─── Users ────────────────────────────────────────────────────────────────────
// Base path: /admin/users  (Controller: UsersController, section 3)
export const USERS = {
  STORE: "/admin/users/store",
  INDEX: "/admin/users/index",
  SHOW: (id: number | string) => `/admin/users/findOne/${id}`,
  FIND_BY_EMAIL: "/admin/users/findOneByEmail",
  UPDATE: (id: number | string) => `/admin/users/update/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/users/toggleStatus/${id}`,
} as const;

// ─── Roles ────────────────────────────────────────────────────────────────────
// Base path: /admin/roles  (Controller: RolesController, section 4)
export const ROLES = {
  STORE: "/admin/roles/store",
  INDEX: "/admin/roles/index",
  SHOW: (id: number | string) => `/admin/roles/show/${id}`,
  UPDATE: (id: number | string) => `/admin/roles/update/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/roles/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/roles/remove/${id}`,
} as const;

// ─── Permissions ──────────────────────────────────────────────────────────────
// Base path: /admin/permissions  (Controller: PermissionsController, section 5)
export const PERMISSIONS = {
  STORE: "/admin/permissions/store",
  INDEX: "/admin/permissions/index",
  SHOW: (id: number | string) => `/admin/permissions/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/permissions/update/${id}`,
  TOGGLE_STATUS: (id: number | string) =>
    `/admin/permissions/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/permissions/remove/${id}`,
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
