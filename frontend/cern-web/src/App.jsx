import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'

import CitizenDashboard from './pages/citizen/CitizenDashboard'
import CreateEmergencyPage from './pages/citizen/CreateEmergencyPage'
import MyEmergenciesPage from './pages/citizen/MyEmergenciesPage'

import VolunteerDashboard from './pages/volunteer/VolunteerDashboard'
import MyAssignedEmergenciesPage from './pages/volunteer/MyAssignedEmergenciesPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AllEmergenciesPage from './pages/admin/AllEmergenciesPage'

import EmergencyDetailsPage from './pages/EmergencyDetailsPage'

import ProtectedRoute from './routes/ProtectedRoute'
import RoleRedirect from './routes/RoleRedirect'
import { ROLES } from './utils/constants'
import { FullPageLoader } from './components/Spinner'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <RoleRedirect /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <RoleRedirect /> : <RegisterPage />} />

      {/* Root redirects based on auth/role */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Citizen routes */}
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CITIZEN]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/create"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CITIZEN]}>
            <CreateEmergencyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/my-emergencies"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CITIZEN]}>
            <MyEmergenciesPage />
          </ProtectedRoute>
        }
      />

      {/* Volunteer routes */}
      <Route
        path="/volunteer/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.VOLUNTEER]}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/assigned"
        element={
          <ProtectedRoute allowedRoles={[ROLES.VOLUNTEER]}>
            <MyAssignedEmergenciesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/emergencies"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AllEmergenciesPage />
          </ProtectedRoute>
        }
      />

      {/* Shared: emergency details — accessible to any authenticated role */}
      <Route
        path="/emergencies/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CITIZEN, ROLES.VOLUNTEER, ROLES.ADMIN]}>
            <EmergencyDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
