import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UnauthorizedPage() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
      <span className="text-5xl mb-4">🚫</span>
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Access Denied</h1>
      <p className="text-sm text-ink2 max-w-sm mb-6">
        Your account role doesn't have permission to view this page.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">Go Home</Link>
        <button onClick={logout} className="btn-secondary">Sign Out</button>
      </div>
    </div>
  )
}
