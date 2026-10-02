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
// Base path: /admin/teachers  (Controller: TeacherController, section 11)
export const TEACHERS = {
  STORE: "/admin/teachers/store",
  INDEX: "/admin/teachers/index",
  SHOW: (id: number | string) => `/admin/teachers/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/teachers/update/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/teachers/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/teachers/remove/${id}`,
} as const;

// ─── Guardians ────────────────────────────────────────────────────────────────
// Base path: /admin/guardians  (Controller: GuardianController, section 12)
export const GUARDIANS = {
  STORE: "/admin/guardians/store",
  INDEX: "/admin/guardians/index",
  SHOW: (id: number | string) => `/admin/guardians/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/guardians/update/${id}`,
  REMOVE: (id: number | string) => `/admin/guardians/remove/${id}`,
} as const;

// ─── Classes ──────────────────────────────────────────────────────────────────
// Base path: /admin/classes  (Controller: SchoolClassController, section 13)
export const CLASSES = {
  STORE: "/admin/classes/store",
  INDEX: "/admin/classes/index",
  SHOW: (id: number | string) => `/admin/classes/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/classes/update/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/classes/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/classes/remove/${id}`,
} as const;

// ─── Students ─────────────────────────────────────────────────────────────────
// Base path: /admin/students  (Controller: StudentController, section 14)
export const STUDENTS = {
  STORE: "/admin/students/store",
  INDEX: "/admin/students/index",
  SHOW: (id: number | string) => `/admin/students/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/students/update/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/students/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/students/remove/${id}`,
} as const;

// ─── Subjects ─────────────────────────────────────────────────────────────────
// Base path: /admin/subjects  (Controller: SubjectController, section 15)
export const SUBJECTS = {
  STORE: "/admin/subjects/store",
  INDEX: "/admin/subjects/index",
  SHOW: (id: number | string) => `/admin/subjects/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/subjects/update/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/subjects/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/subjects/remove/${id}`,
} as const;

// ─── Class Subjects ───────────────────────────────────────────────────────────
// Base path: /admin/class-subjects  (Controller: ClassSubjectController, section 16)
export const CLASS_SUBJECTS = {
  STORE: "/admin/class-subjects/store",
  BY_CLASS: (classId: number | string) =>
    `/admin/class-subjects/class/${classId}`,
  BY_TEACHER: (teacherId: number | string) =>
    `/admin/class-subjects/teacher/${teacherId}`,
  UPDATE: (id: number | string) => `/admin/class-subjects/update/${id}`,
  REMOVE: (id: number | string) => `/admin/class-subjects/remove/${id}`,
} as const;

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const DASHBOARD = {
  SUMMARY: "/admin/dashboard/summary",
} as const;

// ─── Attendance (API doc section 15) ──────────────────────────────────────────
// Base path: /admin/attendance
export const ATTENDANCE = {
  MARK: "/admin/attendance/mark",
  /** GET, optional ?date=YYYY-MM-DD (defaults to today on the server) */
  BY_CLASS: (classId: number | string) => `/admin/attendance/class/${classId}`,
  BY_STUDENT: (studentId: number | string) =>
    `/admin/attendance/student/${studentId}`,
  UPDATE: (id: number | string) => `/admin/attendance/update/${id}`,
} as const;

// ─── Assignments ──────────────────────────────────────────────────────────────
// Base path: /admin/assignments
export const ASSIGNMENTS = {
  STORE: "/admin/assignments/store",
  INDEX: "/admin/assignments/index",
  SHOW: (id: number | string) => `/admin/assignments/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/assignments/update/${id}`,
  REMOVE: (id: number | string) => `/admin/assignments/remove/${id}`,
  UPDATE_SUBMISSION: (submissionId: number | string) =>
    `/admin/assignments/submissions/update/${submissionId}`,
} as const;

// ─── Exams ────────────────────────────────────────────────────────────────────
// Base path: /admin/exams
export const EXAMS = {
  STORE: "/admin/exams/store",
  INDEX: "/admin/exams/index",
  SHOW: (id: number | string) => `/admin/exams/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/exams/update/${id}`,
  TOGGLE_STATUS: (id: number | string) => `/admin/exams/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/exams/remove/${id}`,
  UPDATE_RESULT: (resultId: number | string) =>
    `/admin/exams/results/update/${resultId}`,
  RESULTS_BY_CLASS: (classId: number | string) =>
    `/admin/exams/results/class/${classId}`,
  RESULTS_BY_STUDENT: (studentId: number | string) =>
    `/admin/exams/results/student/${studentId}`,
} as const;

// ─── Role-Permissions (section 6) ─────────────────────────────────────────────
// Base path: /admin/role-permissions
export const ROLE_PERMISSIONS = {
  STORE: "/admin/role-permissions/store",
  INDEX: "/admin/role-permissions/index",
  SHOW: (id: number | string) => `/admin/role-permissions/findOne/${id}`,
  UPDATE: (id: number | string) => `/admin/role-permissions/update/${id}`,
  TOGGLE_STATUS: (id: number | string) =>
    `/admin/role-permissions/toggleStatus/${id}`,
  REMOVE: (id: number | string) => `/admin/role-permissions/remove/${id}`,
} as const;

// ─── Admin-Roles (section 7) ──────────────────────────────────────────────────
// Base path: /admin/roles-assigning-admin
export const ADMIN_ROLES = {
  STORE: "/admin/roles-assigning-admin/store",
  INDEX: "/admin/roles-assigning-admin/index",
  SHOW: (id: number | string) =>
    `/admin/roles-assigning-admin/findOne/${id}`,
  UPDATE: (id: number | string) =>
    `/admin/roles-assigning-admin/update/${id}`,
  TOGGLE_STATUS: (id: number | string) =>
    `/admin/roles-assigning-admin/toggleStatus/${id}`,
  REMOVE: (id: number | string) =>
    `/admin/roles-assigning-admin/remove/${id}`,
} as const;

// ─── User-Roles (section 8) ───────────────────────────────────────────────────
// Base path: /admin/roles-assigning-user
// NOTE: 8.2 list endpoint is /list (not /index) — per API_DOCUMENTATION.txt exactly
export const USER_ROLES = {
  STORE: "/admin/roles-assigning-user/store",
  LIST: "/admin/roles-assigning-user/list",
  SHOW: (id: number | string) =>
    `/admin/roles-assigning-user/findOne/${id}`,
  UPDATE: (id: number | string) =>
    `/admin/roles-assigning-user/update/${id}`,
  TOGGLE_STATUS: (id: number | string) =>
    `/admin/roles-assigning-user/toggleStatus/${id}`,
  REMOVE: (id: number | string) =>
    `/admin/roles-assigning-user/remove/${id}`,
} as const;

// ─── Admin-Permissions (section 9) ────────────────────────────────────────────
// Base path: /admin/permission-assigning-admin
export const ADMIN_PERMISSIONS = {
  STORE: "/admin/permission-assigning-admin/store",
  INDEX: "/admin/permission-assigning-admin/index",
  SHOW: (id: number | string) =>
    `/admin/permission-assigning-admin/findOne/${id}`,
  UPDATE: (id: number | string) =>
    `/admin/permission-assigning-admin/update/${id}`,
  TOGGLE_STATUS: (id: number | string) =>
    `/admin/permission-assigning-admin/toggleStatus/${id}`,
  REMOVE: (id: number | string) =>
    `/admin/permission-assigning-admin/remove/${id}`,
} as const;

// ─── User-Permissions (section 10) ────────────────────────────────────────────
// Base path: /admin/permission-assigning-user
export const USER_PERMISSIONS = {
  STORE: "/admin/permission-assigning-user/store",
  INDEX: "/admin/permission-assigning-user/index",
  SHOW: (id: number | string) =>
    `/admin/permission-assigning-user/findOne/${id}`,
  UPDATE: (id: number | string) =>
    `/admin/permission-assigning-user/update/${id}`,
  TOGGLE_STATUS: (id: number | string) =>
    `/admin/permission-assigning-user/toggleStatus/${id}`,
  REMOVE: (id: number | string) =>
    `/admin/permission-assigning-user/remove/${id}`,
} as const;
