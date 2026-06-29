import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

const NAV_BY_ROLE = {
  [ROLES.CITIZEN]: [
    { to: '/citizen/dashboard', label: 'Home', icon: '🏠' },
    { to: '/citizen/create', label: 'Report', icon: '🆘' },
    { to: '/citizen/my-emergencies', label: 'Mine', icon: '📋' },
  ],
  [ROLES.VOLUNTEER]: [
    { to: '/volunteer/dashboard', label: 'Home', icon: '🏠' },
    { to: '/volunteer/assigned', label: 'Assigned', icon: '🦺' },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/emergencies', label: 'All', icon: '🚨' },
  ],
}

export default function MobileNav() {
  const { role, logout } = useAuth()
  const links = NAV_BY_ROLE[role] || []

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-line flex items-stretch px-2 pb-[env(safe-area-inset-bottom)]">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium ${
              isActive ? 'text-brand-red2' : 'text-ink3'
            }`
          }
        >
          <span className="text-lg">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
      <button
        onClick={logout}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium text-ink3"
      >
        <span className="text-lg">🚪</span>
        Sign Out
      </button>
    </nav>
  )
}
