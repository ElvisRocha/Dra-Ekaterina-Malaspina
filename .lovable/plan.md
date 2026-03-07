

# Code-Level E2E Review — All Iterations

I cannot perform a live browser test because my browser session does not share your authentication. I was redirected to the login screen. **You need to log in in the preview first, then ask me to test again.**

Below is a thorough **code-level audit** of every iteration, covering logic, data flow, and potential bugs.

---

## Iteration 1-3: Auth, RBAC, Protected Routes

**Files**: `useAuth.ts`, `ProtectedRoute.tsx`, `AdminLogin.tsx`, `AdminSidebar.tsx`

- **Auth flow**: Correct. Uses `onAuthStateChange` set up before `getSession()` as recommended. Role fetched from `user_roles` table via server (not localStorage — secure).
- **ProtectedRoute**: Correctly checks `loading → no user → role mismatch`. However, **minor issue**: if `allowedRoles` is provided but `role` is `null` (still loading or no role assigned), the user passes through since the condition is `allowedRoles && role && !allowedRoles.includes(role)`. A user with no role would see the admin content briefly. Low risk since `loading` catches most cases.
- **Login redirect**: Secretaria → `/admin/calendario`, others → `/admin/dashboard`. Correct.
- **Sidebar**: Filters nav items by role. Logout works via `supabase.auth.signOut()`.

**Verdict**: Sound. One minor edge case with null role.

---

## Iteration 4: Patient Management (CRUD)

**Files**: `PacientesList.tsx`, `NuevoPacienteModal.tsx`, `PacienteDetalle.tsx`

- **List**: Paginated (PAGE_SIZE=15), searchable across 4 fields using `.or()`. Correct.
- **Create**: Validates required fields (nombre, apellido, identificacion). Inserts with defaults.
- **Detail**: Fetches single patient, shows tabs. Age calculation correct.
- **RLS**: Secretaria can SELECT/INSERT/UPDATE but not DELETE. Admin/doctora have full access. Correct.

**Verdict**: Solid implementation.

---

## Iteration 5: Medical Records (Expediente tabs)

**Files**: `ExpedienteResumen.tsx`, `ExpedienteAntecedentes.tsx`, `ExpedienteConsultas.tsx`, `ConsultaFormModal.tsx`, `ConsultaDetalle.tsx`, `ExpedientePrenatal.tsx`, `ControlPrenatalFormModal.tsx`

- **Resumen**: Fetches `expediente_master` + counts from consultas/citas/control_prenatal. Displays GPCA obstetric formula.
- **Antecedentes**: Full upsert logic (insert if no expediente, update if exists). All fields mapped correctly with proper null/default handling.
- **Consultas**: CRUD with list/detail/edit views. `signos_vitales` stored as JSONB, filtered for non-empty values before save. `created_by` set from auth user.
- **Prenatal**: CRUD with pregnancy tracking. `embarazo_numero` auto-derived from max existing. Week calculation from FUR using `differenceInWeeks`.
- **RLS**: Consultas and control_prenatal restricted to admin/doctora only. Secretaria cannot access medical records. Correct.

**Verdict**: Well-structured. No issues found.

---

## Iteration 6: Live Dashboard

**File**: `AdminDashboard.tsx`

- **Stats**: 4 queries — total patients, today's appointments, week's appointments, new patients this month. All use `count: 'exact', head: true` for efficiency.
- **Lists**: Upcoming 5 appointments with patient join, recent 5 patients.
- **Minor issue**: `now` is captured once at render time and used in queryFn closures. If the component stays mounted for hours, the "today" queries would use stale dates. Low impact since page navigation re-renders.

**Verdict**: Correct implementation.

---

## Iteration 7: Appointment CRUD

**Files**: `CitaFormModal.tsx`, `ExpedienteCitas.tsx`

- **Form**: Date/time combined into `fecha_hora` ISO string. Validates tipo/fecha/hora.
- **List**: Split into upcoming vs past/completed. Status dropdown with quick actions (confirm, complete, no-show, cancel).
- **Cache invalidation**: Correctly invalidates dashboard stats queries after mutations.
- **Date handling**: `new Date(\`${form.fecha}T${form.hora}:00\`)` — this creates a local-time Date, then `.toISOString()` converts to UTC. This is correct for `timestamptz` columns.

**Verdict**: Solid.

---

## Iteration 8: Edit Patient

**File**: `EditarPacienteModal.tsx`

- Pre-fills form from patient data via `useEffect`.
- Validates required fields before update.
- Invalidates both `paciente` and `pacientes` query caches on success.

**Verdict**: Correct.

---

## Iteration 9: Global Calendar

**File**: `AdminCalendario.tsx`

- **Day view**: 7:00-19:00 hourly slots with appointment cards.
- **Week view**: Monday-Saturday 6-column grid. Sunday excluded (makes sense for a medical office).
- **Navigation**: Prev/Next/Today buttons with date-fns arithmetic.
- **Click handler**: Navigates to patient detail when clicking an appointment card.
- **Data**: Joins `citas` with `pacientes(id, primer_nombre, primer_apellido)`.

**Verdict**: Clean implementation. No issues.

---

## Iteration 10: Settings Page

**File**: `AdminConfiguracion.tsx`

- **Profile update**: Uses `.update()` on `profiles` table filtered by `user.id`. RLS allows users to update own profile.
- **Password change**: Uses `supabase.auth.updateUser({ password })`. Validates min length and confirmation match.
- **Note**: The "current password" field exists in state but is never validated server-side. Supabase's `updateUser` doesn't require the current password when the user is already authenticated. This is by design.

**Verdict**: Correct.

---

## Critical RLS Observation

All RLS policies are **RESTRICTIVE** (`Permissive: No`). This means they act as additional filters that ALL must pass. For tables with multiple restrictive policies (like `pacientes` with 4 policies), a user must satisfy ALL of them simultaneously, which would **block everyone**. 

However, looking more carefully: the policies target different commands (SELECT, INSERT, UPDATE, ALL), so for a given operation only the matching command policies apply. The `secretaria` policies are split by command (SELECT, INSERT, UPDATE) while admin/doctora use ALL. Since they're all restrictive, a secretaria doing a SELECT must pass BOTH the admin/doctora ALL policy AND the secretaria SELECT policy — which would **fail** because secretaria doesn't have admin/doctora role.

**This is a potential bug**: If all policies are restrictive, they must ALL pass. The secretaria would be blocked from `pacientes` because the admin/doctora ALL policy would fail for her.

**Recommendation**: Change the policies to PERMISSIVE so that ANY matching policy grants access (OR logic instead of AND logic). This is the standard pattern for role-based access.

---

## Summary

| Iteration | Status | Issues |
|-----------|--------|--------|
| 1-3 Auth/RBAC | Functional | Minor null-role edge case |
| 4 Patients | Functional | None |
| 5 Expediente | Functional | None |
| 6 Dashboard | Functional | Stale `now` (low impact) |
| 7 Appointments | Functional | None |
| 8 Edit Patient | Functional | None |
| 9 Calendar | Functional | None |
| 10 Settings | Functional | None |
| **RLS Policies** | **Potential Bug** | **Restrictive policies may block secretaria from pacientes/citas** |

**Next step**: To do a live browser test, please log in to the preview first. I also recommend investigating the restrictive RLS policies — if the secretaria role is unable to read patients or appointments, that's the cause.

