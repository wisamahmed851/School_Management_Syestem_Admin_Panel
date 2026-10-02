# School Management Admin Panel: Flows

Runtime flows of the Next.js admin panel. Layering, folder rules and conventions: `ARCHITECTURE.txt`. Backend contract: `../School_Management_Syestem/API_DOCUMENTATION.txt`, backend overview: `../School_Management_Syestem/ARCHITECTURE.md` and `FLOW.md`.

Scope: this panel is for **admins only**. The teacher and parent experiences are a separate app that calls `/user/teacher/*` and `/user/parent/*` on the same backend. Nothing in this repo serves a teacher or parent.

## 1. Layering (every feature)
```
page (src/app/(dashboard)/<feature>/...)
  -> feature hook   src/hooks/use-<feature>.ts        TanStack Query (queries, mutations, invalidation)
  -> API module     src/lib/api/<feature>.ts          one function per endpoint
  -> shared client  src/lib/api/client.ts             axios instance, bearer header, error interceptor
  -> endpoints      src/lib/api/endpoints.ts          the only place URLs are written
  -> NestJS API
```
Types in `src/types/`, Zod schemas in `src/lib/validators/`, shared UI in `src/components/{ui,shared,layout}`. Pages never call axios or `fetch` directly.

## 2. Login and session
```
/login  (public)
  submit {email, password}  -> useLogin -> POST /admin/login
     ok   -> access_token written to the cookie `access_token`; admin object kept in the auth store;
             React Query cache cleared; router goes to /dashboard
     400  -> "invalid email or password" shown on the form; 403 -> deactivated message
every other route
  src/proxy.ts: no `access_token` cookie -> redirect to /login ; "/" -> /dashboard
  (cookie presence is UX only; the backend validates the token on every call)
any API call returns 401 (expired, revoked, deactivated)
  client.ts interceptor: clear cookie + auth store + query cache -> redirect to /login (not when already on /login)
logout -> POST /admin/logout, then the same clearing
```
Switching accounts in the same tab cannot show the previous admin's data: the query cache is cleared on both login and logout.

## 3. Menu, permissions and "No access"
```
dashboard layout mounts -> useSidebar -> GET /admin/me/menu  (cached 5 min)
   -> { permissions[], menu[] } built by the backend from the admin's effective permissions
Sidebar renders the groups / leaves from `menu` (a leaf is shown when the admin holds any action of it)
Each list page: useRouteActions("/teachers").actions.create|update|remove|toggleStatus
   -> hides buttons the admin cannot use (UX only)
Direct URL to a page whose first path segment is not in the menu (e.g. /teachers for a limited admin)
   -> layout shows the "No access" card instead of the page   (/profile is always allowed)
Whatever the UI shows, the backend returns 403 for a missing permission
```
A new admin has no permissions until a role is assigned (`/admins/new` has a role select, or `/admins/[id]/roles`, `/admins/[id]/permissions`).

## 4. Typical list -> create -> edit -> delete
```
list page   useXList() -> GET /admin/<res>/index -> DataTable (loading skeleton, empty state, error)
New         react-hook-form + zod schema -> optional empty fields removed with omitEmpty()
            -> useCreateX() -> POST .../store -> invalidate list -> router.push(list)
            error: 409 shown on the field (e.g. duplicate email), 400 `message[]` joined, 403 "insufficient permissions"
Edit        useX(id) -> form reset from data -> useUpdateX() -> PUT .../update/:id
Toggle      PUT/GET .../toggleStatus/:id  (deactivating a user / admin revokes their session server-side)
Delete      ConfirmDialog -> DELETE .../remove/:id ; 409 shown when the record is still in use
```
Uploaded images (admin / user avatars) go through `ImageUpload`; URLs are built with `uploadUrl()` from `NEXT_PUBLIC_API_URL`.

## 5. Setting up a school (recommended order in the UI)
```
1  Subjects          /subjects/new                      name + unique code
2  Teachers          /teachers/new                      creates the teacher AND a login (role teacher)
3  Guardians         /guardians/new                     creates the guardian AND a login (role parent)
4  Classes           /classes/new                       optional class teacher = the homeroom teacher
5  Students          /students/new                      pick guardian + class; roll no. and identity number are unique
6  Subject mapping   /classes/[id]/subjects             subject + optional teacher (also /teachers/[id]/subjects to review)
```
Step 4's class teacher decides who can mark that class's attendance in the teacher app; step 6's teacher decides who can create assignments for that class and subject.

## 6. Daily operations
```
Attendance  /attendance
   pick class + date -> roster = class students merged with already-saved records ("n already marked")
   set Present / Absent / Late per student (or "Mark all present") -> Save -> POST /admin/attendance/mark
   saving the same date again corrects earlier values; success / error banner shown
Assignments /assignments, /assignments/new, /assignments/[id]
   create (class, mapped subject, teacher, due date) -> pending submission rows are created for the class
   detail page: edit title / description / due date (class locked), submissions table with status, marks, feedback and Save per row
   negative marks are rejected by the server and shown inline
Exams       /exams, /exams/new, /exams/[id]
   create (type, class, mapped subject, date, total marks) -> pending result rows are created
   detail page: edit details, enter marks per student -> % and Pass / Fail come from the server (pass mark 40 %)
   marks outside 0..total are rejected ("Marks must be between 0 and N"); "Absent" clears marks
Dashboard   /dashboard -> GET /admin/dashboard/summary: active students / teachers / classes, today's attendance, upcoming exams and assignments
```

## 7. Access management
```
Roles          /roles, /roles/[id]/permissions        role + its permission matrix (guard must match)
Permissions    /permissions                            catalog (seeded by the backend)
Admins         /admins, /admins/[id]/roles, /admins/[id]/permissions
Users          /users, /users/[id]/roles, /users/[id]/permissions   (user direct permissions are stored but not enforced by the backend)
Profile        /profile  view profile, change password, logout
```

## 8. Running it
```
backend  : .env from .env.example, MySQL up, `npm run build && node dist/main`
panel    : .env.local with NEXT_PUBLIC_API_URL=<backend url>; the panel origin must be in the backend CORS_ORIGINS
           `npm run dev` (or `next dev -p 3102`) / `npm run build && npm start`
checks   : npx tsc --noEmit, npx eslint src, npm run build   (no test framework installed yet)
```
Verified live on 2026-10-02 with the browser: login, setup flow, attendance, exams, grading, limited-admin 403 and the "No access" page.
