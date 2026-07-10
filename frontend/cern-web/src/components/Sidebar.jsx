import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'
import { initials } from '../utils/format'

const NAV_BY_ROLE = {
  [ROLES.CITIZEN]: [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/citizen/create', label: 'Report Emergency', icon: '🆘' },
    { to: '/citizen/my-emergencies', label: 'My Emergencies', icon: '📋' },
  ],
  [ROLES.VOLUNTEER]: [
    { to: '/volunteer/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/volunteer/assigned', label: 'My Assigned', icon: '🦺' },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/emergencies', label: 'All Emergencies', icon: '🚨' },
  ],
}

export default function Sidebar() {
  const { role, user, logout } = useAuth()
  const links = NAV_BY_ROLE[role] || []

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-card border-r border-line px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-orange flex items-center justify-center shadow-glow flex-shrink-0">
          <span className="text-white font-bold text-lg">✦</span>
        </div>
        <div>
          <p className="font-display font-bold text-sm tracking-wide">CERN</p>
          <p className="text-[10px] text-ink3 tracking-wide">Emergency Response</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-red/15 text-brand-red2'
                  : 'text-ink2 hover:text-ink hover:bg-bg3'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

            {/* Emergency Hotlines */}
      <div className="border-t border-line pt-4 mt-4">
        <h3 className="text-[11px] uppercase tracking-wider text-ink3 mb-3 px-2">
          Emergency Hotlines
        </h3>

        <div className="space-y-2 mb-5">

          <a
            href="tel:108"
            className="flex items-center justify-between rounded-xl bg-bg3 px-3 py-2 hover:bg-bg2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>🚑</span>
              <span className="text-sm text-ink">Ambulance</span>
            </div>

            <span className="font-semibold text-brand-green">
              108
            </span>
          </a>

          <a
            href="tel:112"
            className="flex items-center justify-between rounded-xl bg-bg3 px-3 py-2 hover:bg-bg2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>👮</span>
              <span className="text-sm text-ink">Police</span>
            </div>

            <span className="font-semibold text-brand-blue">
              112
            </span>
          </a>

          <a
            href="tel:101"
            className="flex items-center justify-between rounded-xl bg-bg3 px-3 py-2 hover:bg-bg2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>🚒</span>
              <span className="text-sm text-ink">Fire</span>
            </div>

            <span className="font-semibold text-brand-red">
              101
            </span>
          </a>

          <a
            href="tel:1091"
            className="flex items-center justify-between rounded-xl bg-bg3 px-3 py-2 hover:bg-bg2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>🆘</span>
              <span className="text-sm text-ink">
                Women Helpline
              </span>
            </div>

            <span className="font-semibold text-brand-amber">
              1091
            </span>
          </a>

        </div>

        {/* User card */}
        <div className="flex items-center gap-3 px-2 mb-3 border-t border-line pt-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials(user?.name)}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">
              {user?.name || 'User'}
            </p>

            <p className="text-[11px] text-ink3 capitalize">
              {role?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn-ghost w-full justify-start px-2"
        >
          <span>🚪</span>
          Sign Out
        </button>
            </div>
    </aside>
  )
}
