# Requirements

## Summary
A university Academic Request Management System (ARMS) that allows students, faculty (Docente), and administrative staff to manage academic requests through a role-based web application. Students submit and track their own requests; Docentes handle the attention and closure workflow; Administrators classify, prioritize, and assign requests. The system uses mock data with role simulation (ESTUDIANTE, DOCENTE, ADMINISTRATIVO) and a green university color palette, providing clear status/priority badges and an AI-suggestion feature per request.

## Use cases

- App Shell & Navigation
  1) Render a sidebar with role-dependent menu items and a top navbar with the university logo and current user info (name + role badge).
  2) Route to the appropriate default page based on the simulated role (ESTUDIANTE → /solicitudes, DOCENTE → /solicitudes, ADMINISTRATIVO → /solicitudes).
  3) Display the main content area to the right of the sidebar using React Router.

- ESTUDIANTE: Submit a New Request
  1) Navigate to "Nueva Solicitud" from the sidebar.
  2) Fill in a form: Tipo (select), Descripción (textarea), and optional Fecha Límite.
  3) Submit the form (mock POST), receive success toast, and redirect to "Mis Solicitudes".

- ESTUDIANTE: View & Manage My Requests
  1) Navigate to "Mis Solicitudes" from the sidebar.
  2) See a table with columns: ID, Tipo, Descripción, Estado (badge), Prioridad (badge), Fecha Registro, Fecha Límite, Acciones.
  3) Click "Ver Detalle" to open the request detail page (read-only fields + history section + AI suggestion section).
  4) Click "Cancelar" (only visible for REGISTRADA status) to cancel the request after a confirmation dialog.
  5) In the detail page, click "Consultar IA" to display a mock AI suggestion (read-only, no confirm button for ESTUDIANTE).

- DOCENTE: View All Requests & Manage Attention Workflow
  1) Navigate to "Todas las Solicitudes" to see all requests with filters for Estado, Tipo, and Prioridad.
  2) See a table with columns: ID, Tipo, Descripción, Estado (badge), Prioridad (badge), Solicitante, Responsable, Fecha Límite, Acciones. Highlight CLASIFICADA rows with assigned responsable in orange.
  3) Click "Ver Detalle" to open any request's detail page.
  4) If status is CLASIFICADA and has a responsable → show "Iniciar Atención" button with optional observation field; confirm to update status to EN_ATENCION.
  5) If status is CLASIFICADA but no responsable → show informational gray message.
  6) If status is EN_ATENCION → show "Marcar Atendida" button; confirm to update status.
  7) If status is ATENDIDA → show "Cerrar Solicitud" button with mandatory observation field; confirm to update status to CERRADA.
  8) Show AI suggestion section with "Consultar IA", "Confirmar Sugerencia", and "Descartar Sugerencia" buttons.

- ADMINISTRATIVO: Classify, Prioritize & Assign Requests
  1) Navigate to "Todas las Solicitudes" to see all requests with full filters.
  2) See all table columns plus a "Gestionar" button per row.
  3) Open the detail page of any request to perform administrative actions.
  4) If status is REGISTRADA → show "Clasificar Solicitud" section: set Tipo and Prioridad (select), then confirm to update status to CLASIFICADA.
  5) After CLASIFICADA, show "Asignar Responsable" section: select a responsable from a mock list and confirm.
  6) Can also cancel any request using "Cancelar Solicitud" (with confirmation) regardless of the requesting user.
  7) Access "Gestión de Usuarios" sidebar link to view a mock list of system users and their roles.

## Plan

### Login & Register (Auth Flow)
1. [x] Reworked `RoleContext` to hold `isAuthenticated`, `login`, `register`, `logout` with mock user store.
2. [x] Built `LoginPage` with email/password form, error display, and demo credential hints.
3. [x] Built `RegisterPage` with nombre, email, rol select, password + confirm fields and validation.
4. [x] Created `ProtectedRoute` guard that redirects unauthenticated users to `/login`.
5. [x] Updated `Navbar` to show logout button and removed role-switcher (role comes from credentials).
6. [x] Wired `/login` and `/register` as public routes; all others protected behind `ProtectedRoute`.

### App Shell & Navigation
1. [x] Set up React Router with routes: `/solicitudes`, `/solicitudes/nueva`, `/solicitudes/:id`, and `/usuarios` (ADMINISTRATIVO only).
2. [x] Create a `RoleContext` that holds the simulated current role (ESTUDIANTE | DOCENTE | ADMINISTRATIVO) with a role-switcher dropdown in the navbar for demo purposes using mock JWT decoding (userId, rol).
3. [x] Build a `Sidebar` component with conditional menu items based on role: ESTUDIANTE shows "Mis Solicitudes" and "Nueva Solicitud"; DOCENTE shows "Todas las Solicitudes" and "Mis Acciones Pendientes"; ADMINISTRATIVO shows "Todas las Solicitudes" and "Gestión de Usuarios".
4. [x] Build a `Navbar` component with the university logo/name, current user name, role badge, and the role-switcher.
5. [x] Apply the green university color palette via Tailwind config: primary #2E7D32, light #A5D6A7, dark #1B5E20, mint #E8F5E9, accent #F9A825, neutral #F5F5F5, text #212121.
6. [x] Create a `Layout` component that composes Sidebar + Navbar + main content area with proper responsive structure.

### ESTUDIANTE: Submit a New Request
1. [x] Create mock data store (in-memory array) for solicitudes with fields: id, tipo, descripcion, estado, prioridad, fechaRegistro, fechaLimite, solicitanteId, solicitanteNombre, responsable, historial[], sugerenciaIA.
2. [x] Build `NuevaSolicitudPage` with a card form: Tipo (Select with options: ACADEMICA, ADMINISTRATIVA, FINANCIERA, TECNICA), Descripción (Textarea, required), Fecha Límite (date input, optional).
3. [x] On submit, add the new solicitud to the mock store with estado=REGISTRADA, prioridad=null, show a success toast, and navigate to /solicitudes.

### ESTUDIANTE: View & Manage My Requests
1. [x] Build `MisSolicitudesPage` that reads from the mock store filtered by the current userId (ESTUDIANTE role). Display a table with all required columns and status/priority badges.
2. [x] Implement `StatusBadge` component with colors: REGISTRADA=#9E9E9E, CLASIFICADA=#1565C0, EN_ATENCION=#EF6C00, ATENDIDA=#2E7D32, CERRADA=#424242, CANCELADA=#B71C1C.
3. [x] Implement `PriorityBadge` component with colors: CRÍTICA=#C62828, ALTA=#EF6C00, MEDIA=#F9A825, BAJA=#A5D6A7.
4. [x] Add "Ver Detalle" button in Acciones column linking to `/solicitudes/:id`. Add "Cancelar" button only when estado===REGISTRADA, triggering a confirmation dialog (AlertDialog) and updating the mock store status to CANCELADA.
5. [x] Build `DetalleSolicitudPage` showing all fields in read-only mode, a historial section listing audit entries, and an AI suggestion section with a "Consultar IA" button that returns a mock AI suggestion text. For ESTUDIANTE, hide confirm/discard AI buttons.

### DOCENTE: View All Requests & Manage Attention Workflow
1. [x] Build `TodasSolicitudesPage` (shared with ADMINISTRATIVO) that displays all mock solicitudes. Add filter controls for Estado (Select), Tipo (Select), and Prioridad (Select) above the table.
2. [x] Render the full table with columns: ID, Tipo, Descripción, Estado badge, Prioridad badge, Solicitante, Responsable ("Sin asignar" if null), Fecha Límite, Acciones. Highlight rows with estado===CLASIFICADA and responsable assigned with an orange left border or background.
3. [x] In `DetalleSolicitudPage`, add a conditional action panel for DOCENTE role: if CLASIFICADA + responsable → show "Iniciar Atención" button with optional observation input; if CLASIFICADA + no responsable → show gray info message; if EN_ATENCION → show "Marcar Atendida" button; if ATENDIDA → show "Cerrar Solicitud" with mandatory observation input.
4. [x] Wire action buttons to update the mock store (estado, historial entry with timestamp and observation) and show success toasts.
5. [x] Add AI section in detail page for DOCENTE: "Consultar IA" fetches mock suggestion, then show "Confirmar Sugerencia" (green) and "Descartar Sugerencia" (red) buttons that update the solicitud's sugerenciaIA field in the mock store.

### ADMINISTRATIVO: Classify, Prioritize & Assign Requests
1. [x] In `DetalleSolicitudPage`, add administrative action panel visible only for ADMINISTRATIVO role: if estado===REGISTRADA → show "Clasificar Solicitud" form with Tipo (Select) and Prioridad (Select: CRÍTICA, ALTA, MEDIA, BAJA), confirm button updates estado to CLASIFICADA and adds historial entry.
2. [x] After classification (estado===CLASIFICADA) → show "Asignar Responsable" section with a Select populated from a mock list of docentes/staff (name + id). Confirm updates the responsable field and adds historial entry.
3. [x] Add "Cancelar Solicitud" button (red, with confirmation dialog) available to ADMINISTRATIVO for any solicitud regardless of solicitanteId.
4. [x] Build `GestionUsuariosPage` at `/usuarios` (only accessible when role===ADMINISTRATIVO) showing a mock table of users: ID, Nombre, Email, Rol (badge), Estado (Activo/Inactivo). Add a search/filter by role.
5. [x] Guard the `/usuarios` route so that ESTUDIANTE and DOCENTE users see a "No autorizado" message or are redirected to /solicitudes.
