import { useState } from 'react'
import {
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { ROLES } from '../../utils/constants'

const HOME_BY_ROLE = {
  [ROLES.CITIZEN]: '/citizen/dashboard',
  [ROLES.VOLUNTEER]: '/volunteer/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.MEDICAL_RESPONDER]: '/medical/dashboard',
  [ROLES.FIRE_RESPONDER]: '/fire/dashboard',
  [ROLES.POLICE_RESPONDER]: '/police/dashboard',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const { role } = await login({
        email: form.email.trim(),
        password: form.password,
      })

      const requestedPath =
        location.state?.from?.pathname

      const redirectTo =
        requestedPath ||
        HOME_BY_ROLE[role] ||
        '/'

      navigate(redirectTo, {
        replace: true,
      })
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
    <div className="min-h-screen bg-bg text-ink">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden border-r border-line/10 bg-card lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />

            <div className="absolute -bottom-40 -right-28 h-[420px] w-[420px] rounded-full bg-brand-blue/10 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-red/25 bg-brand-red/10">
                <HeartPulse
                  size={22}
                  strokeWidth={2}
                  className="text-brand-red"
                />
              </div>

              <div>
                <p className="font-display text-base font-semibold tracking-[0.14em] text-ink">
                  CERN
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink3">
                  Community Emergency Response Network
                </p>
              </div>
            </div>
          </div>

          <div className="relative max-w-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red2">
              Coordinated response
            </p>

            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink xl:text-5xl">
              Faster reporting.
              <br />
              Smarter dispatch.
              <br />
              Safer communities.
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-ink2">
              A unified emergency operations platform connecting citizens,
              volunteers, professional responders and administrators through
              real-time incident coordination.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-lg border border-line/10 bg-bg/40 px-4 py-3 backdrop-blur">
              <ShieldCheck
                size={18}
                strokeWidth={1.9}
                className="flex-shrink-0 text-brand-green"
              />

              <p className="text-xs leading-5 text-ink2">
                Secure access with encrypted passwords, JWT authentication and
                role-based authorization.
              </p>
            </div>
          </div>

          <p className="relative text-xs text-ink3">
            Emergency response infrastructure for modern communities
          </p>
        </section>

        {/* Login panel */}
        <main className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-red/25 bg-brand-red/10">
                <HeartPulse
                  size={21}
                  strokeWidth={2}
                  className="text-brand-red"
                />
              </div>

              <div>
                <p className="font-display text-sm font-semibold tracking-[0.13em] text-ink">
                  CERN
                </p>

                <p className="text-[10px] uppercase tracking-[0.1em] text-ink3">
                  Emergency Response
                </p>
              </div>
            </div>

            <div className="mb-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">
                Secure access
              </p>

              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-ink2">
                Sign in to access your emergency response workspace.
              </p>
            </div>

            <div className="card p-6 sm:p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {error && (
                  <ErrorAlert
                    message={error}
                    onClose={() => setError('')}
                  />
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="label-text"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3"
                    />

                    <input
                      id="email"
                      type="email"
                      required
                      className="input-field pl-11"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={update('email')}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-medium text-ink2"
                    >
                      Password
                    </label>

                    <span className="text-[11px] text-ink3">
                      Case-sensitive
                    </span>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      required
                      className="input-field px-11"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={update('password')}
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-ink3 transition-colors hover:bg-bg4 hover:text-ink"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={17}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Eye
                          size={17}
                          strokeWidth={1.8}
                        />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary h-12 w-full"
                >
                  {loading ? (
                    <Spinner size={18} />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-line/10" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink3">
                  New to CERN
                </span>

                <div className="h-px flex-1 bg-line/10" />
              </div>

              <p className="text-center text-sm text-ink2">
                Create a citizen or volunteer account{' '}
                <Link
                  to="/register"
                  className="font-semibold text-brand-red2 transition-colors hover:text-brand-red"
                >
                  Register
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-ink3">
              By signing in, you agree to use this platform responsibly and
              only for genuine emergency-response activity.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}