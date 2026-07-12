import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import * as userService from '../../services/userService'
import ErrorAlert from '../../components/ErrorAlert'

const SECTIONS = [
  { key: 'account', label: 'Account', icon: '👤' },
  { key: 'security', label: 'Security', icon: '🔒' },
  { key: 'appearance', label: 'Appearance', icon: '🎨' },
  { key: 'notifications', label: 'Notifications', icon: '🔔' },
  { key: 'about', label: 'About', icon: 'ℹ️' },
]

export default function SettingsPage() {
  const {
  user,
  role,
  logout,
  updateCurrentUser,
} = useAuth()
  const [activeSection, setActiveSection] = useState('account')
  const [theme, setTheme] = useState(
    localStorage.getItem('cern_theme') || 'dark'
  )
  const [name, setName] = useState(user?.name || '')
const [phone, setPhone] = useState(user?.phone || '')
const [saving, setSaving] = useState(false)
const [message, setMessage] = useState('')
const [accountError, setAccountError] = useState('')

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
    const updatedUser = await userService.updateProfile({
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
  return (
    <DashboardLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <div className="card p-3 h-fit">
          <div className="space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === section.key
                    ? 'bg-brand-red/15 text-brand-red2'
                    : 'text-ink2 hover:bg-bg3 hover:text-ink'
                }`}
              >
                <span>{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
         {activeSection === 'account' && (
  <div>
    <h2 className="font-display text-xl font-bold text-ink mb-1">
      Account
    </h2>

    <p className="text-sm text-ink3 mb-6">
      Manage your profile information.
    </p>

    {message && (
      <div className="mb-4 rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">
        {message}
      </div>
    )}

    {accountError && (
      <div className="mb-4">
        <ErrorAlert message={accountError} />
      </div>
    )}

    <form onSubmit={handleSaveProfile}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text">Name</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>

        <div>
          <label className="label-text">Phone</label>
          <input
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
          <label className="label-text">Email</label>
          <input
            type="email"
            className="input-field opacity-70"
            value={user?.email || ''}
            readOnly
          />
          <p className="text-[11px] text-ink3 mt-1">
            Email cannot be changed.
          </p>
        </div>

        <div>
          <label className="label-text">Role</label>
          <input
            type="text"
            className="input-field opacity-70 capitalize"
            value={
              role
                ? role
                    .toLowerCase()
                    .replaceAll('_', ' ')
                : ''
            }
            readOnly
          />
          <p className="text-[11px] text-ink3 mt-1">
            Role is managed by the system.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-primary mt-6"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  </div>
)}

          {activeSection === 'security' && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink mb-1">
                Security
              </h2>
              <p className="text-sm text-ink3 mb-6">
                Manage password and account security options.
              </p>

              <div className="space-y-4">
                <button
                  type="button"
                  className="btn-primary"
                >
                  Change Password
                </button>

                <button
                  type="button"
                  className="btn-ghost"
                >
                  Logout from all devices
                </button>

                <div className="rounded-xl border border-line bg-bg3 p-4">
                  <p className="text-sm font-medium text-ink">
                    Two-factor authentication
                  </p>
                  <p className="text-xs text-ink3 mt-1">
                    Coming soon
                  </p>
                </div>
                <button
  type="button"
  onClick={logout}
  className="btn-ghost text-brand-red2"
>
  🚪 Sign Out
</button>
              </div>
            </div>

          )}

          {activeSection === 'appearance' && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink mb-1">
                Appearance
              </h2>
              <p className="text-sm text-ink3 mb-6">
                Choose how CERN looks on this device.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => applyTheme(option)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      theme === option
                        ? 'border-brand-red bg-brand-red/10'
                        : 'border-line bg-bg3 hover:border-line2'
                    }`}
                  >
                    <p className="font-semibold text-ink capitalize">
                      {option}
                    </p>
                    <p className="text-xs text-ink3 mt-1">
                      {option === 'light'
                        ? 'Bright interface'
                        : option === 'dark'
                          ? 'Dark interface'
                          : 'Match device settings'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink mb-1">
                Notifications
              </h2>
              <p className="text-sm text-ink3 mb-6">
                Choose which alerts you want to receive.
              </p>

              <div className="space-y-4">
                {[
                  'Emergency updates',
                  'Live dashboard alerts',
                  'Sound alerts',
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-bg3 p-4"
                  >
                    <span className="text-sm text-ink">
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked={label !== 'Sound alerts'}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink mb-1">
                About CERN
              </h2>
              <p className="text-sm text-ink3 mb-6">
                Community Emergency Response Network
              </p>

              <div className="space-y-3 text-sm text-ink2">
                <p>Version 1.0.0</p>
                <p>Frontend: React</p>
                <p>Backend: Spring Boot</p>
                <p>Database: PostgreSQL</p>
                <p>Real-time: WebSocket + STOMP</p>
                <p>Maps: Leaflet + OpenStreetMap</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}