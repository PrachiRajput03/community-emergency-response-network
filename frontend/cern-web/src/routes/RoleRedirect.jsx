import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

const HOME_BY_ROLE = {
  [ROLES.CITIZEN]: '/citizen/dashboard',
  [ROLES.VOLUNTEER]: '/volunteer/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
}

export default function RoleRedirect() {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const target = HOME_BY_ROLE[role] || '/login'
  return <Navigate to={target} replace />
}
