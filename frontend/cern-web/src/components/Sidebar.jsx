import { NavLink } from 'react-router-dom'
import {
  Activity,
  Ambulance,
  ClipboardList,
  FileWarning,
  Flame,
  HeartPulse,
  Home,
  LayoutDashboard,
  LogOut,
  Phone,
  Settings,
  Shield,
  Siren,
  UserRound,
  UsersRound,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'
import { initials } from '../utils/format'

const NAV_BY_ROLE = {
  [ROLES.CITIZEN]: [
    {
      to: '/citizen/dashboard',
      label: 'Overview',
      icon: Home,
    },
    {
      to: '/citizen/create',
      label: 'Report Emergency',
      icon: Siren,
    },
    {
      to: '/citizen/my-emergencies',
      label: 'My Reports',
      icon: ClipboardList,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ],

  [ROLES.VOLUNTEER]: [
    {
      to: '/volunteer/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/volunteer/assigned',
      label: 'Assigned Cases',
      icon: UsersRound,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ],

  [ROLES.ADMIN]: [
  {
    to: '/admin/dashboard',
    label: 'Operations',
    icon: LayoutDashboard,
  },
  {
    to: '/admin/emergencies',
    label: 'All Emergencies',
    icon: FileWarning,
  },
  {
    to: '/admin/responders',
    label: 'Manage Responders',
    icon: UsersRound,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
  },
],

  [ROLES.MEDICAL_RESPONDER]: [
    {
      to: '/medical/dashboard',
      label: 'Medical Operations',
      icon: Ambulance,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ],

  [ROLES.FIRE_RESPONDER]: [
    {
      to: '/fire/dashboard',
      label: 'Fire Operations',
      icon: Flame,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ],

  [ROLES.POLICE_RESPONDER]: [
    {
      to: '/police/dashboard',
      label: 'Police Operations',
      icon: Shield,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ],
}

const HOTLINES = [
  {
    label: 'Ambulance',
    number: '108',
    icon: Ambulance,
  },
  {
    label: 'National Emergency',
    number: '112',
    icon: Shield,
  },
  {
    label: 'Fire Service',
    number: '101',
    icon: Flame,
  },
  {
    label: 'Women Helpline',
    number: '1091',
    icon: Phone,
  },
]

const formatRole = (role) => {
  if (!role) return 'User'

  return role
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}

export default function Sidebar() {
  const { role, user, logout } = useAuth()
  const links = NAV_BY_ROLE[role] || []

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-line/10 bg-card px-4 py-5 lg:flex">
      {/* Brand */}
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-brand-red/25 bg-brand-red/10">
          <HeartPulse
            size={21}
            strokeWidth={2}
            className="text-brand-red"
          />
        </div>

        <div className="min-w-0">
          <p className="font-display text-sm font-semibold tracking-[0.12em] text-ink">
            CERN
          </p>

          <p className="truncate text-[10px] font-medium uppercase tracking-[0.1em] text-ink3">
            Emergency Response
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-2 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink3">
          Navigation
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5',
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-red/10 text-brand-red2'
                    : 'text-ink2 hover:bg-bg3 hover:text-ink',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? 'text-brand-red'
                        : 'text-ink3 transition-colors group-hover:text-ink2'
                    }
                  />

                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Hotlines */}
      <div className="border-t border-line/10 pt-4">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink3">
            Emergency Contacts
          </p>

          <Activity
            size={13}
            className="text-brand-green"
          />
        </div>

        <div className="mb-4 space-y-1">
          {HOTLINES.map((hotline) => {
            const Icon = hotline.icon

            return (
              <a
                key={hotline.number}
                href={`tel:${hotline.number}`}
                className="group flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-bg3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Icon
                    size={15}
                    strokeWidth={1.8}
                    className="flex-shrink-0 text-ink3 transition-colors group-hover:text-ink"
                  />

                  <span className="truncate text-xs text-ink2 group-hover:text-ink">
                    {hotline.label}
                  </span>
                </div>

                <span className="ml-2 text-xs font-semibold tabular-nums text-ink">
                  {hotline.number}
                </span>
              </a>
            )
          })}
        </div>

        {/* Account */}
        <div className="border-t border-line/10 pt-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-line/10 bg-bg3 text-xs font-semibold text-ink">
              {user?.name ? (
                initials(user.name)
              ) : (
                <UserRound size={16} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {user?.name || 'User'}
              </p>

              <p className="truncate text-[11px] text-ink3">
                {formatRole(role)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink2 transition-colors hover:bg-brand-red/10 hover:text-brand-red2"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}