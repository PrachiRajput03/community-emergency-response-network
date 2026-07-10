import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'

import ResponderDashboard from './pages/responders/ResponderDashboard'
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

import DepartmentDetailsPage from './pages/admin/DepartmentDetailsPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <RoleRedirect /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <RoleRedirect /> : <RegisterPage />} />
      <Route path="/" element={<RoleRedirect />} />

      <Route path="/citizen/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.CITIZEN]}><CitizenDashboard /></ProtectedRoute>} />
      <Route path="/citizen/create" element={<ProtectedRoute allowedRoles={[ROLES.CITIZEN]}><CreateEmergencyPage /></ProtectedRoute>} />
      <Route path="/citizen/my-emergencies" element={<ProtectedRoute allowedRoles={[ROLES.CITIZEN]}><MyEmergenciesPage /></ProtectedRoute>} />

      <Route path="/volunteer/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.VOLUNTEER]}><VolunteerDashboard /></ProtectedRoute>} />
      <Route path="/volunteer/assigned" element={<ProtectedRoute allowedRoles={[ROLES.VOLUNTEER]}><MyAssignedEmergenciesPage /></ProtectedRoute>} />

      <Route path="/medical/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.MEDICAL_RESPONDER]}><ResponderDashboard type="medical" /></ProtectedRoute>} />
      <Route path="/fire/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.FIRE_RESPONDER]}><ResponderDashboard type="fire" /></ProtectedRoute>} />
      <Route path="/police/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.POLICE_RESPONDER]}><ResponderDashboard type="police" /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/emergencies" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AllEmergenciesPage /></ProtectedRoute>} />

      <Route
  path="/admin/departments/medical"
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <DepartmentDetailsPage type="medical" />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/departments/fire"
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <DepartmentDetailsPage type="fire" />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/departments/police"
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <DepartmentDetailsPage type="police" />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/departments/community"
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <DepartmentDetailsPage type="community" />
    </ProtectedRoute>
  }
/>

      <Route
        path="/emergencies/:id"
        element={
          <ProtectedRoute
            allowedRoles={[
              ROLES.CITIZEN,
              ROLES.VOLUNTEER,
              ROLES.MEDICAL_RESPONDER,
              ROLES.FIRE_RESPONDER,
              ROLES.POLICE_RESPONDER,
              ROLES.ADMIN,
            ]}
          >
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