---
inclusion: always
---

# SMS Admin — Architecture Rules

> **This file is the single source of truth for how this project is structured and developed.**
> Every future change — new resource, new page, new API integration — MUST follow these rules without exception.
> Update this file if the structure legitimately changes, but never silently violate it.

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx          ← login page (fully implemented)
│   ├── (dashboard)/
│   │   ├── layout.tsx                 ← dashboard shell (Sidebar + Header)
│   │   ├── dashboard/page.tsx
│   │   ├── admins/page.tsx, new/page.tsx, [id]/page.tsx
│   │   ├── roles/page.tsx
│   │   ├── permissions/page.tsx
│   │   ├── teachers/page.tsx
│   │   ├── guardians/page.tsx
│   │   ├── classes/page.tsx
│   │   ├── students/page.tsx
│   │   ├── subjects/page.tsx
│   │   ├── class-subjects/page.tsx
│   │   ├── attendance/page.tsx
│   │   ├── assignments/page.tsx
│   │   └── exams/page.tsx
│   ├── layout.tsx                     ← root layout: wraps with QueryProvider only
│   └── globals.css
├── lib/
│   ├── api/
│   │   ├── client.ts                  ← axios instance + request/response interceptors
│   │   ├── endpoints.ts               ← ALL route constants grouped by resource
│   │   ├── auth.ts                    ← login call (and future auth calls)
│   │   └── <resource>.ts             ← one file per resource, exports <resource>Api object
│   ├── auth/
│   │   ├── auth-store.ts              ← zustand store: token, admin, isAuthenticated
│   │   ├── permissions.ts             ← permission helper functions
│   │   └── guards.tsx                 ← route guard components
│   └── validators/
│       ├── login.schema.ts            ← zod schema (email + password)
│       └── <resource>.schema.ts      ← one zod schema per resource
├── hooks/
│   ├── use-login.ts                   ← react-query mutation wrapping authApi.login
│   └── use-<resource>.ts             ← one hook file per resource
├── components/
│   ├── layout/                        ← Sidebar, SidebarItem, Header, Breadcrumbs
│   ├── ui/                            ← primitive UI components (empty, fill as needed)
│   └── shared/                        ← DataTable, ConfirmDialog, StatusBadge
├── types/
│   ├── admin.ts                       ← mirrors POST /admin/login response exactly
│   └── <resource>.ts                 ← one type file per resource
├── providers/
│   └── query-provider.tsx             ← QueryClientProvider wrapper
└── proxy.ts                           ← auth redirect guard (Next.js 16 "proxy")
```

---

## The 6 Inviolable Rules

### Rule 1 — All API calls go through `lib/api/client.ts`
Never call `axios` or `fetch` directly in a component or hook.
Every network request must use the `apiClient` instance from `lib/api/client.ts`.

### Rule 2 — Strict 3-layer architecture
```
page/component  →  hook (hooks/)  →  api function (lib/api/<resource>.ts)  →  client.ts
```
No layer may be skipped. A component may not import from `lib/api/` directly.
A hook may not call `apiClient` directly — it must go through an api file.

### Rule 3 — Route strings live only in `lib/api/endpoints.ts`
Never hardcode a URL string (e.g. `"/admins"`) inside a hook or api file.
Always import the constant from `endpoints.ts`.

### Rule 4 — Types must mirror API response shapes exactly
Types in `types/` must match the exact shape documented in the API spec.
Do not invent fields. Do not omit fields. If the API changes, update the type.

### Rule 5 — No business logic in `app/` page files
Page components only compose hooks and layout components.
All data-fetching, mutation, validation, and transformation logic belongs in `hooks/` and `lib/`.

### Rule 6 — Sidebar data always comes from `GET /admin/sidebar`
Render the sidebar menu exactly as returned by the API via the `useSidebar` hook.
Never reconstruct or hard-code the menu tree from role/permission data on the client.

---

## Adding a New Resource

When adding a new resource (e.g. `reports`), create all of the following:

| File | Purpose |
|------|---------|
| `src/types/report.ts` | Types matching API response shape |
| `src/lib/validators/report.schema.ts` | Zod validation schema |
| `src/lib/api/reports.ts` | API functions using `apiClient` + `REPORTS` endpoints |
| `src/lib/api/endpoints.ts` | Add `REPORTS` constant group |
| `src/hooks/use-reports.ts` | React Query hooks wrapping `reportsApi` |
| `src/app/(dashboard)/reports/page.tsx` | Page composing hook + components |

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.x | Framework (uses `proxy.ts` not `middleware.ts`) |
| `react` | 19.x | UI |
| `@tanstack/react-query` | 5.x | Server state / data fetching |
| `zustand` | 5.x | Client state (auth) |
| `axios` | 1.x | HTTP client |
| `react-hook-form` | 7.x | Form management |
| `zod` | 4.x | Schema validation |
| `@hookform/resolvers` | 5.x | RHF ↔ Zod bridge |
| `js-cookie` | 3.x | Cookie access in browser |

---

## Next.js 16 Notes

- **`middleware.ts` is deprecated** — use `proxy.ts` with `export function proxy()`.
- `LayoutProps<'/path'>` is a globally available type helper — no import needed.
- `params` in layouts/pages is a `Promise` — use `async/await` or `React.use()`.
