import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { ROLES } from '../../utils/constants'

const ROLE_OPTIONS = [
  { value: ROLES.CITIZEN, label: 'Citizen', desc: 'Report emergencies & track help', icon: '🆘' },
  { value: ROLES.VOLUNTEER, label: 'Volunteer', desc: 'Respond to emergency requests', icon: '🦺' },
  { value: ROLES.ADMIN, label: 'Admin', desc: 'Monitor & manage the network', icon: '📊' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: ROLES.CITIZEN,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const selectRole = (role) => setForm((f) => ({ ...f, role }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await register(form)
      if (result?.token) {
        // Auto-logged in — go straight to dashboard
        navigate('/', { replace: true })
      } else {
        // Backend doesn't auto-login on register — send to login
        navigate('/login', { replace: true, state: { registered: true } })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please check your details and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center shadow-glow mb-4">
            <span className="text-white font-bold text-2xl">✦</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Create Account</h1>
          <p className="text-sm text-ink2 mt-1 text-center">Join the community emergency response network</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorAlert message={error} onClose={() => setError('')} />}

            <div>
              <label className="label-text">Full Name</label>
              <input
                type="text" required className="input-field" placeholder="Arjun Sharma"
                value={form.name} onChange={update('name')} autoComplete="name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Email Address</label>
                <input
                  type="email" required className="input-field" placeholder="you@example.com"
                  value={form.email} onChange={update('email')} autoComplete="email"
                />
              </div>
              <div>
                <label className="label-text">Phone Number</label>
                <input
                  type="tel" required className="input-field" placeholder="+91 98765 43210"
                  value={form.phone} onChange={update('phone')} autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="label-text">Password</label>
              <input
                type="password" required minLength={6} className="input-field" placeholder="••••••••"
                value={form.password} onChange={update('password')} autoComplete="new-password"
              />
            </div>

            <div>
              <label className="label-text">I am registering as</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectRole(opt.value)}
                    className={`flex flex-col items-center text-center gap-1.5 px-3 py-4 rounded-xl border-2 transition-all ${
                      form.role === opt.value
                        ? 'border-brand-red bg-card2'
                        : 'border-line bg-bg3 hover:border-line2'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-xs font-semibold text-ink">{opt.label}</span>
                    <span className="text-[10px] text-ink3 leading-tight">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 mt-2">
              {loading ? <Spinner size={18} /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-ink2 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-red2 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
