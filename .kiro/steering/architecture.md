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

---

## Theming Rules

> These rules apply to every component, page, and UI element in this project — no exceptions.

### Rule T1 — No hardcoded colors, ever
Never use a hardcoded color value (hex like `#4338CA`, rgb, or a raw Tailwind palette class like `bg-blue-500` / `text-indigo-600`) in any component file.
Always use semantic token classes that map to the CSS variables defined in `globals.css`:
- Backgrounds: `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `bg-secondary`, `bg-accent`, `bg-destructive`, `bg-success`, `bg-warning`
- Text: `text-foreground`, `text-card-foreground`, `text-muted-foreground`, `text-primary-foreground`, `text-accent-foreground`, `text-destructive`, `text-success`, `text-warning`
- Borders: `border-border`, `border-input`, `border-destructive`, `border-success`, `border-warning`
- Ring: `ring-ring`

### Rule T2 — Never build primitives from scratch
If you need a button, input, dialog, table, badge, select, avatar, or any other common UI primitive, check `components/ui/` first.
If it doesn't exist there yet, run `npx shadcn add <component>` to install it, then compose.
Do not hand-roll HTML elements styled to look like a primitive.

### Rule T3 — Component placement
- `components/ui/` — shadcn primitives only. Never edit these files. Never add custom components here.
- `components/shared/` — shared composite components used across multiple pages (DataTable, StatusBadge, ConfirmDialog, etc.).
- `components/layout/` — structural layout components (Sidebar, Header, Breadcrumbs, SidebarItem).
- Page-specific one-off UI (a single-use empty state, a unique illustration) lives inline in the page file only.

### Rule T4 — All new status/state variants go in StatusBadge.tsx
If a new resource introduces a new status string (e.g. `"draft"`, `"archived"`, `"approved"`), add a mapping entry to `components/shared/StatusBadge.tsx`.
Never create a one-off badge with custom color classes in a page or component.

### Token Reference (globals.css)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | `#4338CA` | `#6366F1` | Main actions, links |
| `--background` | `#FFFFFF` | `#0B1120` | Page background |
| `--card` | `#FFFFFF` | `#111827` | Card/panel surfaces |
| `--muted` | `#F8FAFC` | `#1E293B` | Subtle backgrounds |
| `--accent` | `#E0E7FF` | `#312E81` | Highlighted items |
| `--destructive` | `#DC2626` | `#EF4444` | Delete/error states |
| `--success` | `#16A34A` | `#22C55E` | Active/present/pass |
| `--warning` | `#D97706` | `#F59E0B` | Pending/late states |
| `--border` | `#E2E8F0` | `#1E293B` | All borders |
| `--muted-foreground` | `#64748B` | `#94A3B8` | Secondary text |
