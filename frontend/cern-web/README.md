# CERN Web — Community Emergency Response Network

A production-ready React web frontend for the CERN emergency response platform, built with Vite, React Router, Tailwind CSS, and Axios, integrating against a Spring Boot backend.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Configure the backend URL

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Point this at wherever your Spring Boot backend is running.

---

## 📁 Project Structure

```
cern-web/
├── src/
│   ├── App.jsx                          # All routes
│   ├── main.jsx                         # Entry point
│   ├── index.css                        # Tailwind + base styles
│   ├── services/
│   │   ├── api.js                       # Axios instance + JWT interceptor
│   │   ├── authService.js               # POST /auth/register, /auth/login
│   │   ├── emergencyService.js          # All /emergencies endpoints
│   │   └── dashboardService.js          # GET /dashboard/stats
│   ├── context/
│   │   └── AuthContext.jsx              # Global auth state (token/role/user)
│   ├── routes/
│   │   ├── ProtectedRoute.jsx           # Role-based route guard
│   │   └── RoleRedirect.jsx             # Redirects "/" to correct dashboard
│   ├── components/
│   │   ├── Sidebar.jsx                  # Desktop nav (role-aware links)
│   │   ├── MobileNav.jsx                # Bottom nav for small screens
│   │   ├── Topbar.jsx                   # Mobile header
│   │   ├── DashboardLayout.jsx          # Shared page shell
│   │   ├── EmergencyCard.jsx            # List item for emergencies
│   │   ├── StatusBadge.jsx              # OPEN / IN_PROGRESS / RESOLVED
│   │   ├── SeverityBadge.jsx            # LOW / MEDIUM / HIGH / CRITICAL
│   │   ├── StatCard.jsx                 # Dashboard stat tile
│   │   ├── ErrorAlert.jsx
│   │   └── Spinner.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── citizen/
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── CreateEmergencyPage.jsx
│   │   │   └── MyEmergenciesPage.jsx
│   │   ├── volunteer/
│   │   │   ├── VolunteerDashboard.jsx
│   │   │   └── MyAssignedEmergenciesPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx       # Charts via Recharts
│   │   │   └── AllEmergenciesPage.jsx
│   │   ├── EmergencyDetailsPage.jsx     # Shared across all roles
│   │   ├── UnauthorizedPage.jsx
│   │   └── NotFoundPage.jsx
│   └── utils/
│       ├── constants.js                 # Enum values, badge metadata
│       └── format.js                    # Date/time formatting helpers
├── .env                                 # VITE_API_BASE_URL
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🔌 Backend Integration

### Endpoints used

| Method | Endpoint | Used by |
|---|---|---|
| POST | `/api/v1/auth/register` | RegisterPage |
| POST | `/api/v1/auth/login` | LoginPage |
| POST | `/api/v1/emergencies` | CreateEmergencyPage |
| GET | `/api/v1/emergencies` | AllEmergenciesPage (ADMIN) |
| GET | `/api/v1/emergencies/{id}` | EmergencyDetailsPage |
| POST | `/api/v1/emergencies/{id}/accept` | VolunteerDashboard, EmergencyDetailsPage |
| POST | `/api/v1/emergencies/{id}/resolve` | MyAssignedEmergenciesPage, EmergencyDetailsPage |
| GET | `/api/v1/emergencies/my` | CitizenDashboard, MyEmergenciesPage |
| GET | `/api/v1/emergencies/my-assigned` | VolunteerDashboard, MyAssignedEmergenciesPage |
| GET | `/api/v1/emergencies/status/{status}` | VolunteerDashboard (OPEN requests) |
| GET | `/api/v1/emergencies/severity/{severity}` | available in `emergencyService.js`, wire up where needed |
| GET | `/api/v1/dashboard/stats` | AdminDashboard |

### JWT handling

`src/services/api.js` is a single Axios instance shared by all three service files. It:
- Attaches `Authorization: Bearer <token>` to every request automatically (token read from `localStorage`)
- Catches `401` responses globally, clears the session, and redirects to `/login`

### ⚠️ Adjust to match your exact backend response shape

Two integration points are written defensively with fallbacks, but you should verify them against your actual Spring Boot DTOs:

1. **`src/context/AuthContext.jsx` → `persistSession()`**
   Expects a login/register response roughly shaped like:
   ```json
   { "token": "...", "role": "CITIZEN", "id": 1, "name": "...", "email": "...", "phone": "..." }
   ```
   If your backend nests the user object differently (e.g. `{ accessToken, user: { ... } }`), update the field accessors in that function.

2. **`src/pages/admin/AdminDashboard.jsx`**
   Expects `/dashboard/stats` to return fields like `totalEmergencies`, `openCount`, `inProgressCount`, `resolvedCount`, `totalVolunteers`, `severityCounts: { LOW, MEDIUM, HIGH, CRITICAL }`. Update the accessors at the top of the component to match your actual DTO.

Everywhere else (emergency objects), the UI reads `id`, `type`, `severity`, `status`, `description`, `address`, `createdAt`, `latitude`, `longitude`, and optionally `acceptedAt`, `resolvedAt`, `reportedBy`/`citizen`, `assignedVolunteer`/`volunteer`. Fields that don't exist simply render as empty/fallback text rather than crashing.

---

## 🔐 Roles & Protected Routes

| Role | Routes |
|---|---|
| `CITIZEN` | `/citizen/dashboard`, `/citizen/create`, `/citizen/my-emergencies` |
| `VOLUNTEER` | `/volunteer/dashboard`, `/volunteer/assigned` |
| `ADMIN` | `/admin/dashboard`, `/admin/emergencies` |
| Any authenticated role | `/emergencies/:id` |

`ProtectedRoute` redirects unauthenticated users to `/login`, and redirects authenticated users with the wrong role to `/unauthorized`. `RoleRedirect` sends `/` to the correct dashboard automatically based on the stored role.

---

## 🎨 Design System

Dark theme with the same color language as the original mobile prototype — `brand.red` for SOS/alerts/critical, `brand.green` for resolved/online, `brand.blue` for in-progress/info, `brand.amber` for open/warnings. Configured in `tailwind.config.js` under `theme.extend.colors`.

Status badges (`OPEN` / `IN_PROGRESS` / `RESOLVED`) and severity badges (`LOW` / `MEDIUM` / `HIGH` / `CRITICAL`) use the exact backend enum values as keys — see `src/utils/constants.js`.

---

## 🧪 Verified

This project was installed (`npm install`) and built (`npm run build`) successfully before packaging — no missing imports or syntax errors.

## 📦 Build for production

```bash
npm run build
npm run preview   # serve the dist/ build locally
```
