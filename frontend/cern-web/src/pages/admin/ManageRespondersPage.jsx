import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Ambulance,
  BadgeCheck,
  Eye,
  EyeOff,
  Flame,
  LoaderCircle,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  UserRound,
  UsersRound,
} from 'lucide-react'

import DashboardLayout from '../../components/DashboardLayout'
import responderService from '../../services/responderService'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'MEDICAL_RESPONDER',
}

const ROLE_CONFIG = {
  MEDICAL_RESPONDER: {
    label: 'Medical Responder',
    shortLabel: 'Medical',
    icon: Ambulance,
    badgeClass:
      'border-blue-500/20 bg-blue-500/10 text-blue-500',
    iconClass: 'text-blue-500',
  },

  FIRE_RESPONDER: {
    label: 'Fire Responder',
    shortLabel: 'Fire',
    icon: Flame,
    badgeClass:
      'border-orange-500/20 bg-orange-500/10 text-orange-500',
    iconClass: 'text-orange-500',
  },

  POLICE_RESPONDER: {
    label: 'Police Responder',
    shortLabel: 'Police',
    icon: Shield,
    badgeClass:
      'border-indigo-500/20 bg-indigo-500/10 text-indigo-500',
    iconClass: 'text-indigo-500',
  },
}

const getErrorMessage = (error) => {
  if (typeof error?.response?.data === 'string') {
    return error.response.data
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

export default function ManageRespondersPage() {
  const [responders, setResponders] = useState([])
  const [formData, setFormData] = useState(INITIAL_FORM)

  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadResponders = async () => {
    try {
      setLoading(true)
      setErrorMessage('')

      const data = await responderService.getAllResponders()

      setResponders(Array.isArray(data) ? data : [])
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResponders()
  }, [])

  useEffect(() => {
    if (!successMessage && !errorMessage) return undefined

    const timeout = window.setTimeout(() => {
      setSuccessMessage('')
      setErrorMessage('')
    }, 5000)

    return () => window.clearTimeout(timeout)
  }, [successMessage, errorMessage])

  const handleInputChange = (event) => {
  const { name, value } = event.target

  console.log("Input changed:", name, value)

  setFormData((current) => ({
    ...current,
    [name]: value,
  }))
}

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Responder name is required.'
    }

    if (!formData.email.trim()) {
      return 'Email address is required.'
    }

    if (!formData.email.includes('@')) {
      return 'Enter a valid email address.'
    }

    if (!formData.phone.trim()) {
      return 'Phone number is required.'
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      return 'Phone number must contain exactly 10 digits.'
    }

    if (!formData.password.trim()) {
      return 'Temporary password is required.'
    }

    if (formData.password.length < 6) {
      return 'Password must contain at least 6 characters.'
    }

    if (!ROLE_CONFIG[formData.role]) {
      return 'Select a valid responder role.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("Submitted form:", formData)

    const validationError = validateForm()

    if (validationError) {
      setErrorMessage(validationError)
      setSuccessMessage('')
      return
    }

    try {
      setCreating(true)
      setErrorMessage('')
      setSuccessMessage('')

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      }

      const response =
        await responderService.createResponder(payload)

      if (
        typeof response === 'string' &&
        !response.toLowerCase().includes('success')
      ) {
        setErrorMessage(response)
        return
      }

      setSuccessMessage(
        typeof response === 'string'
          ? response
          : 'Responder created successfully'
      )

      setFormData(INITIAL_FORM)
      setShowPassword(false)

      await loadResponders()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setCreating(false)
    }
  }

  const statistics = useMemo(() => {
    return responders.reduce(
      (result, responder) => {
        result.total += 1

        if (responder.role === 'MEDICAL_RESPONDER') {
          result.medical += 1
        }

        if (responder.role === 'FIRE_RESPONDER') {
          result.fire += 1
        }

        if (responder.role === 'POLICE_RESPONDER') {
          result.police += 1
        }

        return result
      },
      {
        total: 0,
        medical: 0,
        fire: 0,
        police: 0,
      }
    )
  }, [responders])

  const filteredResponders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return responders.filter((responder) => {
      const matchesRole =
        roleFilter === 'ALL' || responder.role === roleFilter

      const matchesSearch =
        !normalizedQuery ||
        responder.name?.toLowerCase().includes(normalizedQuery) ||
        responder.email?.toLowerCase().includes(normalizedQuery) ||
        responder.phone?.toLowerCase().includes(normalizedQuery)

      return matchesRole && matchesSearch
    })
  }, [responders, searchQuery, roleFilter])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-line/10 bg-card p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-brand-red/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                  <Activity size={13} />
                  Administrative Control
                </span>
              </div>

              <h1 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                Manage Responders
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink2">
                Create and monitor professional emergency response
                accounts for medical, fire and police departments.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-line/10 bg-bg3/60 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                <UsersRound size={20} />
              </div>

              <div>
                <p className="text-xs text-ink3">
                  Registered personnel
                </p>

                <p className="text-xl font-semibold text-ink">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        {successMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-brand-green/20 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">
            <BadgeCheck
              size={18}
              className="mt-0.5 flex-shrink-0"
            />

            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-brand-red/20 bg-brand-red/10 px-4 py-3 text-sm text-brand-red2">
            <Shield
              size={18}
              className="mt-0.5 flex-shrink-0"
            />

            <p>{errorMessage}</p>
          </div>
        )}

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Responders"
            value={statistics.total}
            icon={UsersRound}
          />

          <StatCard
            label="Medical"
            value={statistics.medical}
            icon={Ambulance}
          />

          <StatCard
            label="Fire"
            value={statistics.fire}
            icon={Flame}
          />

          <StatCard
            label="Police"
            value={statistics.police}
            icon={Shield}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          {/* Create responder form */}
          <div className="h-fit rounded-2xl border border-line/10 bg-card p-5 shadow-sm">
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                  <Plus size={18} />
                </div>

                <h2 className="font-display text-lg font-semibold text-ink">
                  Create Responder
                </h2>
              </div>

              <p className="text-sm leading-6 text-ink3">
                Create a secure login account for a professional
                responder.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <FormField
                label="Full name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter responder name"
                icon={UserRound}
                autoComplete="name"
              />

              <FormField
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="responder@example.com"
                icon={Mail}
                autoComplete="email"
              />

              <FormField
                label="Phone number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                icon={Phone}
                maxLength={10}
                autoComplete="tel"
              />

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-ink2"
                >
                  Temporary password
                </label>

                <div className="relative">
                  <Shield
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink3"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-line/10 bg-bg3 py-2.5 pl-10 pr-11 text-sm text-ink outline-none transition placeholder:text-ink3 focus:border-brand-red/40 focus:ring-2 focus:ring-brand-red/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink3 transition hover:text-ink"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-1.5 block text-xs font-semibold text-ink2"
                >
                  Department role
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-line/10 bg-bg3 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-red/40 focus:ring-2 focus:ring-brand-red/10"
                >
                  <option value="MEDICAL_RESPONDER">
                    Medical Responder
                  </option>

                  <option value="FIRE_RESPONDER">
                    Fire Responder
                  </option>

                  <option value="POLICE_RESPONDER">
                    Police Responder
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Creating responder...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Create Responder
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Responder directory */}
          <div className="min-w-0 rounded-2xl border border-line/10 bg-card p-5 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Responder Directory
                </h2>

                <p className="mt-1 text-sm text-ink3">
                  {filteredResponders.length} responder
                  {filteredResponders.length === 1 ? '' : 's'} shown
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink3"
                  />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search responders"
                    className="w-full rounded-lg border border-line/10 bg-bg3 py-2.5 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink3 focus:border-brand-red/40 sm:w-56"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value)
                  }
                  className="rounded-lg border border-line/10 bg-bg3 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-red/40"
                >
                  <option value="ALL">All departments</option>
                  <option value="MEDICAL_RESPONDER">
                    Medical
                  </option>
                  <option value="FIRE_RESPONDER">Fire</option>
                  <option value="POLICE_RESPONDER">
                    Police
                  </option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-72 flex-col items-center justify-center text-center">
                <LoaderCircle
                  size={30}
                  className="mb-3 animate-spin text-brand-red"
                />

                <p className="text-sm font-medium text-ink">
                  Loading responders
                </p>

                <p className="mt-1 text-xs text-ink3">
                  Retrieving professional personnel records
                </p>
              </div>
            ) : filteredResponders.length === 0 ? (
              <EmptyState
                hasResponders={responders.length > 0}
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredResponders.map((responder) => (
                  <ResponderCard
                    key={responder.id || responder.email}
                    responder={responder}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-line/10 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-ink3">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-ink">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg3 text-ink2">
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}

function FormField({
  label,
  icon: Icon,
  name,
  ...inputProps
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-ink2"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink3"
        />

        <input
          id={name}
          name={name}
          {...inputProps}
          className="w-full rounded-lg border border-line/10 bg-bg3 py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-ink3 focus:border-brand-red/40 focus:ring-2 focus:ring-brand-red/10"
        />
      </div>
    </div>
  )
}

function ResponderCard({ responder }) {
  const config =
    ROLE_CONFIG[responder.role] ||
    ROLE_CONFIG.MEDICAL_RESPONDER

  const Icon = config.icon

  return (
    <article className="rounded-xl border border-line/10 bg-bg3/40 p-4 transition hover:border-line/20 hover:bg-bg3/70">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-line/10 bg-card">
          <Icon
            size={20}
            className={config.iconClass}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-ink">
                {responder.name || 'Unnamed Responder'}
              </h3>

              <span
                className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${config.badgeClass}`}
              >
                {config.shortLabel}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/20 bg-brand-green/10 px-2 py-1 text-[10px] font-semibold text-brand-green">
              <BadgeCheck size={11} />
              Active
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex min-w-0 items-center gap-2 text-xs text-ink2">
              <Mail
                size={14}
                className="flex-shrink-0 text-ink3"
              />

              <span className="truncate">
                {responder.email || 'Email unavailable'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-ink2">
              <Phone
                size={14}
                className="flex-shrink-0 text-ink3"
              />

              <span>
                {responder.phone || 'Phone unavailable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function EmptyState({ hasResponders }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-line/15 bg-bg3/30 px-5 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-card text-ink3">
        <UsersRound size={22} />
      </div>

      <h3 className="text-sm font-semibold text-ink">
        {hasResponders
          ? 'No matching responders'
          : 'No responders created yet'}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-ink3">
        {hasResponders
          ? 'Try changing the search text or department filter.'
          : 'Use the creation form to register your first medical, fire or police responder.'}
      </p>
    </div>
  )
}