import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { ROLES } from '../../utils/constants'

const HOME_BY_ROLE = {
  [ROLES.CITIZEN]: '/citizen/dashboard',
  [ROLES.VOLUNTEER]: '/volunteer/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { role } = await login(form)
      const redirectTo = location.state?.from?.pathname || HOME_BY_ROLE[role] || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-brand-red/5" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-brand-red/[0.03]" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center shadow-glow mb-4">
            <span className="text-white font-bold text-3xl">✦</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Welcome Back</h1>
          <p className="text-sm text-ink2 mt-1 text-center">Sign in to access the emergency response network</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorAlert message={error} onClose={() => setError('')} />}

            <div>
              <label className="label-text">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={update('password')}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 mt-2">
              {loading ? <Spinner size={18} /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-ink2 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-red2 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
