import { useEffect, useState } from 'react'
import {
  Bell,
  BellRing,
  CheckCircle2,
  Database,
  Info,
  Laptop,
  LockKeyhole,
  LogOut,
  Map,
  Moon,
  Palette,
  Radio,
  Save,
  Server,
  ShieldCheck,
  Smartphone,
  Sun,
  UserRound,
  Wifi,
} from 'lucide-react'

import DashboardLayout from '../../components/DashboardLayout'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import * as userService from '../../services/userService'

const SECTIONS = [
  {
    key: 'account',
    label: 'Account',
    icon: UserRound,
  },
  {
    key: 'security',
    label: 'Security',
    icon: LockKeyhole,
  },
  {
    key: 'appearance',
    label: 'Appearance',
    icon: Palette,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    key: 'about',
    label: 'About',
    icon: Info,
  },
]

const THEME_OPTIONS = [
  {
    value: 'light',
    label: 'Light',
    description: 'Use a bright interface',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Use a dark interface',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Match this device',
    icon: Laptop,
  },
]

const ABOUT_ITEMS = [
  {
    label: 'Version',
    value: '1.0.0',
    icon: Info,
  },
  {
    label: 'Frontend',
    value: 'React + Vite',
    icon: Laptop,
  },
  {
    label: 'Backend',
    value: 'Spring Boot',
    icon: Server,
  },
  {
    label: 'Database',
    value: 'PostgreSQL',
    icon: Database,
  },
  {
    label: 'Real-time',
    value: 'WebSocket + STOMP',
    icon: Radio,
  },
  {
    label: 'Maps',
    value: 'Leaflet + OpenStreetMap',
    icon: Map,
  },
]

const readBooleanPreference = (key, fallback) => {
  const storedValue = localStorage.getItem(key)

  if (storedValue === null) {
    return fallback
  }

  return storedValue === 'true'
}

export default function SettingsPage() {
  const {
    user,
    role,
    logout,
    updateCurrentUser,
  } = useAuth()

  const [activeSection, setActiveSection] =
    useState('account')

  const [theme, setTheme] = useState(
    localStorage.getItem('cern_theme') || 'dark'
  )

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [accountError, setAccountError] = useState('')

  const [emergencyUpdates, setEmergencyUpdates] =
    useState(() =>
      readBooleanPreference(
        'cern_emergency_updates',
        true
      )
    )

  const [dashboardAlerts, setDashboardAlerts] =
    useState(() =>
      readBooleanPreference(
        'cern_dashboard_alerts',
        true
      )
    )

  const [soundAlerts, setSoundAlerts] = useState(
    () =>
      readBooleanPreference(
        'cern_sound_alerts',
        false
      )
  )

  useEffect(() => {
    setName(user?.name || '')
    setPhone(user?.phone || '')
  }, [user])

  const applyTheme = (value) => {
    setTheme(value)
    localStorage.setItem('cern_theme', value)

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    const shouldUseDark =
      value === 'dark' ||
      (value === 'system' && prefersDark)

    document.documentElement.classList.toggle(
      'dark',
      shouldUseDark
    )
  }

  const updateNotificationPreference = (
    key,
    value,
    setter
  ) => {
    setter(value)
    localStorage.setItem(key, String(value))
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()

    setMessage('')
    setAccountError('')

    if (!name.trim()) {
      setAccountError('Name is required.')
      return
    }

    setSaving(true)

    try {
      const updatedUser =
        await userService.updateProfile({
          name: name.trim(),
          phone: phone.trim(),
        })

      updateCurrentUser(updatedUser)
      setMessage('Profile updated successfully.')
    } catch (error) {
      setAccountError(
        error.response?.data?.message ||
          'Failed to update profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  const formattedRole = role
    ? role
        .toLowerCase()
        .split('_')
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(' ')
    : ''

  return (
    <DashboardLayout title="Settings">
      {/* Page header */}
      <section className="mb-8 border-b border-line/10 pb-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">
          Application preferences
        </p>

        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
          Settings
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink2">
          Manage your account, security preferences,
          notifications and application appearance.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Settings navigation */}
        <aside className="card h-fit p-3">
          <nav className="space-y-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon
              const selected =
                activeSection === section.key

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() =>
                    setActiveSection(section.key)
                  }
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-brand-red/10 text-brand-red2'
                      : 'text-ink2 hover:bg-bg3 hover:text-ink'
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={
                      selected ? 2.1 : 1.8
                    }
                    className={
                      selected
                        ? 'text-brand-red'
                        : 'text-ink3'
                    }
                  />

                  {section.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Settings content */}
        <main className="card min-w-0 p-6 sm:p-8">
          {activeSection === 'account' && (
            <section>
              <SectionHeader
                title="Account"
                description="Manage your personal profile information."
                icon={UserRound}
              />

              {message && (
                <div className="mb-5 flex items-center gap-2 rounded-lg border border-brand-green/25 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                  />
                  {message}
                </div>
              )}

              {accountError && (
                <div className="mb-5">
                  <ErrorAlert
                    message={accountError}
                  />
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="settings-name"
                      className="label-text"
                    >
                      Full name
                    </label>

                    <input
                      id="settings-name"
                      type="text"
                      className="input-field"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="settings-phone"
                      className="label-text"
                    >
                      Phone number
                    </label>

                    <input
                      id="settings-phone"
                      type="tel"
                      className="input-field"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="label-text">
                      Email address
                    </label>

                    <input
                      type="email"
                      className="input-field cursor-not-allowed opacity-70"
                      value={user?.email || ''}
                      readOnly
                    />

                    <p className="mt-1.5 text-[11px] text-ink3">
                      Email cannot be changed.
                    </p>
                  </div>

                  <div>
                    <label className="label-text">
                      Account role
                    </label>

                    <input
                      type="text"
                      className="input-field cursor-not-allowed opacity-70"
                      value={formattedRole}
                      readOnly
                    />

                    <p className="mt-1.5 text-[11px] text-ink3">
                      Roles are managed by the system.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary mt-6"
                >
                  {saving ? (
                    <>
                      <Spinner size={16} />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save
                        size={16}
                        strokeWidth={2}
                      />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </section>
          )}

          {activeSection === 'security' && (
            <section>
              <SectionHeader
                title="Security"
                description="Review account access and security options."
                icon={ShieldCheck}
              />

              <div className="space-y-4">
                <div className="rounded-lg border border-line/10 bg-bg3 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-green/10">
                      <ShieldCheck
                        size={19}
                        className="text-brand-green"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Protected account
                      </p>

                      <p className="mt-1 text-xs leading-5 text-ink3">
                        Your account uses password hashing,
                        JWT authentication and role-based
                        authorization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-line/10 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        Change password
                      </p>

                      <p className="mt-1 text-xs text-ink3">
                        Password management is not yet
                        available in this release.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="btn-secondary cursor-not-allowed opacity-50"
                    >
                      <LockKeyhole size={15} />
                      Coming Soon
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-line/10 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        Two-factor authentication
                      </p>

                      <p className="mt-1 text-xs text-ink3">
                        Add another verification step to
                        account sign-in.
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-line/10 bg-bg3 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink3">
                      Planned
                    </span>
                  </div>
                </div>

                <div className="border-t border-line/10 pt-5">
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-red2 transition-colors hover:bg-brand-red/10"
                  >
                    <LogOut
                      size={16}
                      strokeWidth={1.9}
                    />
                    Sign Out
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'appearance' && (
            <section>
              <SectionHeader
                title="Appearance"
                description="Choose how CERN appears on this device."
                icon={Palette}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const selected =
                    theme === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        applyTheme(option.value)
                      }
                      className={`rounded-lg border p-4 text-left transition-all ${
                        selected
                          ? 'border-brand-red bg-brand-red/10 ring-2 ring-brand-red/15'
                          : 'border-line/10 bg-bg3 hover:border-line2/25 hover:bg-bg4'
                      }`}
                    >
                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
                          selected
                            ? 'bg-brand-red/15 text-brand-red2'
                            : 'bg-bg4 text-ink2'
                        }`}
                      >
                        <Icon
                          size={19}
                          strokeWidth={1.9}
                        />
                      </div>

                      <p className="text-sm font-semibold text-ink">
                        {option.label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-ink3">
                        {option.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {activeSection === 'notifications' && (
            <section>
              <SectionHeader
                title="Notifications"
                description="Control the alerts stored for this browser."
                icon={BellRing}
              />

              <div className="space-y-3">
                <PreferenceRow
                  icon={BellRing}
                  title="Emergency updates"
                  description="Receive alerts when an emergency is reported or updated."
                  checked={emergencyUpdates}
                  onChange={(value) =>
                    updateNotificationPreference(
                      'cern_emergency_updates',
                      value,
                      setEmergencyUpdates
                    )
                  }
                />

                <PreferenceRow
                  icon={Radio}
                  title="Live dashboard alerts"
                  description="Show real-time alert banners while using the dashboard."
                  checked={dashboardAlerts}
                  onChange={(value) =>
                    updateNotificationPreference(
                      'cern_dashboard_alerts',
                      value,
                      setDashboardAlerts
                    )
                  }
                />

                <PreferenceRow
                  icon={Smartphone}
                  title="Sound alerts"
                  description="Allow this browser to play sounds for incoming alerts."
                  checked={soundAlerts}
                  onChange={(value) =>
                    updateNotificationPreference(
                      'cern_sound_alerts',
                      value,
                      setSoundAlerts
                    )
                  }
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-ink3">
                These preferences are stored locally on this
                browser. Browser-level notification permission
                is controlled by your device settings.
              </p>
            </section>
          )}

          {activeSection === 'about' && (
            <section>
              <SectionHeader
                title="About CERN"
                description="Community Emergency Response Network"
                icon={Info}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ABOUT_ITEMS.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.label}
                      className="rounded-lg border border-line/10 bg-bg3 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-bg4 text-ink2">
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink3">
                            {item.label}
                          </p>

                          <p className="mt-1 text-sm font-medium text-ink">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-lg border border-line/10 bg-bg3 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Wifi
                    size={17}
                    strokeWidth={1.9}
                    className="text-brand-green"
                  />

                  <h3 className="text-sm font-semibold text-ink">
                    Platform capabilities
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs text-ink2 sm:grid-cols-2">
                  {[
                    'Role-based access control',
                    'Real-time incident updates',
                    'Department dispatch dashboards',
                    'Interactive emergency maps',
                    'CSV and PDF report exports',
                    'Light, dark and system themes',
                  ].map((capability) => (
                    <div
                      key={capability}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2
                        size={14}
                        className="flex-shrink-0 text-brand-green"
                      />

                      {capability}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
}

function SectionHeader({
  title,
  description,
  icon: Icon,
}) {
  return (
    <div className="mb-7 border-b border-line/10 pb-5">
      <div className="flex items-center gap-2">
        <Icon
          size={18}
          strokeWidth={1.9}
          className="text-brand-red2"
        />

        <h2 className="font-display text-xl font-semibold text-ink">
          {title}
        </h2>
      </div>

      <p className="mt-2 text-sm leading-6 text-ink3">
        {description}
      </p>
    </div>
  )
}

function PreferenceRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-line/10 bg-bg3 p-4 transition-colors hover:bg-bg4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-bg4 text-ink2">
          <Icon
            size={17}
            strokeWidth={1.8}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-ink">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-ink3">
            {description}
          </p>
        </div>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 flex-shrink-0 accent-brand-red"
      />
    </label>
  )
}