import { useState } from 'react'
import {
  Eye,
  EyeOff,
  HeartHandshake,
  HeartPulse,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { ROLES } from '../../utils/constants'

const ROLE_OPTIONS = [
  {
    value: ROLES.CITIZEN,
    label: 'Citizen',
    description: 'Report emergencies and track response progress.',
    icon: UserRound,
    accent: 'text-brand-blue',
    surface: 'bg-brand-blue/10',
  },
  {
    value: ROLES.VOLUNTEER,
    label: 'Volunteer',
    description: 'Assist with community emergency requests.',
    icon: HeartHandshake,
    accent: 'text-brand-green',
    surface: 'bg-brand-green/10',
  },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: ROLES.CITIZEN,
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

  const selectRole = (role) => {
    setForm((current) => ({
      ...current,
      role,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!form.name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!form.email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!form.phone.trim()) {
      setError('Please enter your phone number.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      })

      if (result?.token || result?.accessToken || result?.jwt) {
        navigate('/', { replace: true })
      } else {
        navigate('/login', {
          replace: true,
          state: { registered: true },
        })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          (typeof err.response?.data === 'string'
            ? err.response.data
            : 'Registration failed. Please check your details and try again.')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        {/* Registration form */}
        <main className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">
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
                Create account
              </p>

              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                Join the response network
              </h1>

              <p className="mt-2 text-sm leading-6 text-ink2">
                Register as a citizen or community volunteer to access CERN.
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
                    htmlFor="name"
                    className="label-text"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3"
                    />

                    <input
                      id="name"
                      type="text"
                      required
                      className="input-field pl-11"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={update('name')}
                      autoComplete="name"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="label-text"
                    >
                      Phone number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3"
                      />

                      <input
                        id="phone"
                        type="tel"
                        required
                        className="input-field pl-11"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={update('phone')}
                        autoComplete="tel"
                      />
                    </div>
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
                      Minimum 6 characters
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
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="input-field px-11"
                      placeholder="Create a secure password"
                      value={form.password}
                      onChange={update('password')}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
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

                <fieldset>
                  <legend className="label-text">
                    Register as
                  </legend>

                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {ROLE_OPTIONS.map((option) => {
                      const Icon = option.icon
                      const selected = form.role === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => selectRole(option.value)}
                          className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                            selected
                              ? 'border-brand-red bg-brand-red/10 ring-2 ring-brand-red/15'
                              : 'border-line/10 bg-bg3 hover:border-line2/25 hover:bg-bg4'
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${option.surface}`}
                          >
                            <Icon
                              size={19}
                              strokeWidth={2}
                              className={option.accent}
                            />
                          </div>

                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                selected
                                  ? 'text-ink'
                                  : 'text-ink2'
                              }`}
                            >
                              {option.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-ink3">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary h-12 w-full"
                >
                  {loading ? (
                    <Spinner size={18} />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-line/10" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink3">
                  Already registered
                </span>

                <div className="h-px flex-1 bg-line/10" />
              </div>

              <p className="text-center text-sm text-ink2">
                Access your existing account{' '}
                <Link
                  to="/login"
                  className="font-semibold text-brand-red2 transition-colors hover:text-brand-red"
                >
                  Sign In
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-ink3">
              Professional responders and administrators are created through
              authorized administrative access.
            </p>
          </div>
        </main>

        {/* Brand panel */}
        <section className="relative hidden overflow-hidden border-l border-line/10 bg-card lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />

            <div className="absolute -bottom-40 -left-28 h-[420px] w-[420px] rounded-full bg-brand-green/10 blur-3xl" />
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
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-green">
              Community participation
            </p>

            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink xl:text-5xl">
              Report quickly.
              <br />
              Respond responsibly.
              <br />
              Support your community.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-ink2">
              CERN helps citizens report incidents and enables verified
              volunteers to support coordinated emergency response operations.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-lg border border-line/10 bg-bg/40 px-4 py-3 backdrop-blur">
              <ShieldCheck
                size={18}
                strokeWidth={1.9}
                className="flex-shrink-0 text-brand-green"
              />

              <p className="text-xs leading-5 text-ink2">
                Self-registration is limited to citizens and volunteers.
                Professional response accounts are controlled by administrators.
              </p>
            </div>
          </div>

          <p className="relative text-xs text-ink3">
            Join a safer, connected emergency-response community
          </p>
        </section>
      </div>
    </div>
  )
}