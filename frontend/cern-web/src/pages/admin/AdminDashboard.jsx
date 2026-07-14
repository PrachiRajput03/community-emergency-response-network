import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Ambulance,
  ArrowUpRight,
  Bell,
  Flame,
  Radio,
  Shield,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import {
  connectEmergencySocket,
  disconnectEmergencySocket,
} from '../../services/websocketService'

import LiveActivityFeed from '../../components/LiveActivityFeed'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import EmergencyMap from '../../components/EmergencyMap'

import * as dashboardService from '../../services/dashboardService'
import * as emergencyService from '../../services/emergencyService'

import {
  SEVERITY_META,
  STATUS_META,
} from '../../utils/constants'

const PIE_COLORS = {
  LOW: '#5a6080',
  MEDIUM: '#3d8bff',
  HIGH: '#ffb83f',
  CRITICAL: '#ff3b5c',
}

const DEPARTMENT_META = {
  MEDICAL: {
    title: 'Medical Response Unit',
    icon: Ambulance,
    path: '/admin/departments/medical',
    accent: 'text-brand-blue',
    surface: 'bg-brand-blue/10',
  },

  FIRE: {
    title: 'Fire Response Unit',
    icon: Flame,
    path: '/admin/departments/fire',
    accent: 'text-brand-red',
    surface: 'bg-brand-red/10',
  },

  POLICE: {
    title: 'Police Response Unit',
    icon: Shield,
    path: '/admin/departments/police',
    accent: 'text-brand-purple',
    surface: 'bg-brand-purple/10',
  },

  COMMUNITY: {
    title: 'Community Volunteer Unit',
    icon: UsersRound,
    path: '/admin/departments/community',
    accent: 'text-brand-green',
    surface: 'bg-brand-green/10',
  },
}

const getActivityIcon = (category) => {
  if (category === 'FIRE') return '🚒'

  if (['MEDICAL', 'ROAD_ACCIDENT'].includes(category)) {
    return '🚑'
  }

  if (['WOMEN_SAFETY', 'CRIME'].includes(category)) {
    return '👮'
  }

  return '🦺'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')
  const [activities, setActivities] = useState([])

  const loadDashboard = () => {
    setError('')

    return Promise.all([
      dashboardService.getDashboardStats(),
      emergencyService.getAllEmergencies(),
    ])
      .then(([statsData, emergenciesData]) => {
        setStats(statsData)

        setEmergencies(
          Array.isArray(emergenciesData)
            ? emergenciesData
            : emergenciesData?.content || []
        )
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            'Failed to load dashboard data.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    loadDashboard()

    connectEmergencySocket('admin', (emergency) => {
      const status = emergency.status || 'UPDATED'
      const icon = getActivityIcon(emergency.category)

      const action =
        status === 'OPEN'
          ? 'New emergency reported'
          : status === 'IN_PROGRESS'
            ? 'Emergency accepted'
            : status === 'RESOLVED'
              ? 'Emergency resolved'
              : 'Emergency updated'

      const newActivity = {
        id: `${emergency.id}-${status}-${Date.now()}`,
        icon,
        message: `${action}: ${
          emergency.title || 'Emergency'
        }`,
        time: new Date().toISOString(),
      }

      setActivities((previous) =>
        [newActivity, ...previous].slice(0, 20)
      )

      setNotification(
        `${action}: ${emergency.title || 'Emergency'}`
      )

      if (
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        const browserTitle =
          status === 'OPEN'
            ? 'New Emergency Reported'
            : status === 'IN_PROGRESS'
              ? 'Emergency Accepted'
              : status === 'RESOLVED'
                ? 'Emergency Resolved'
                : 'Emergency Updated'

        new Notification(browserTitle, {
          body: `${emergency.title || 'Emergency'}\n${
            emergency.location || 'Location unavailable'
          }`,
          icon: '/logo.png',
        })
      }

      loadDashboard()

      setTimeout(() => {
        setNotification('')
      }, 10000)
    })

    return () => {
      disconnectEmergencySocket()
    }
  }, [])

  const totalEmergencies = stats?.totalEmergencies ?? 0
  const openCount = stats?.openEmergencies ?? 0
  const inProgressCount =
    stats?.inProgressEmergencies ?? 0
  const resolvedCount = stats?.resolvedEmergencies ?? 0
  const totalVolunteers = stats?.totalVolunteers ?? 0
  const totalCitizens = stats?.totalCitizens ?? 0
  const departmentStats = stats?.departmentStats || []

  const criticalCount =
    stats?.severityCounts?.CRITICAL ?? 0

  const activeCount = openCount + inProgressCount

  const resolutionRate =
    totalEmergencies > 0
      ? Math.round(
          (resolvedCount / totalEmergencies) * 100
        )
      : 0

  const statusBarData = [
    {
      name: STATUS_META.OPEN.label,
      value: openCount,
      color: '#ffb83f',
    },
    {
      name: STATUS_META.IN_PROGRESS.label,
      value: inProgressCount,
      color: '#3d8bff',
    },
    {
      name: STATUS_META.RESOLVED.label,
      value: resolvedCount,
      color: '#22e56b',
    },
  ]

  const severityCounts = stats?.severityCounts || {}

  const severityPieData = Object.keys(SEVERITY_META)
    .map((key) => ({
      name: SEVERITY_META[key].label,
      value: severityCounts[key] ?? 0,
      key,
    }))
    .filter((item) => item.value > 0)

  const tooltipStyle = {
    background: '#161c2a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    fontSize: 12,
    color: '#ffffff',
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Operations header */}
      <section className="mb-8 flex flex-col gap-4 border-b border-line/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Radio
              size={14}
              strokeWidth={2}
              className="text-brand-green"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-green">
              Live operations
            </span>
          </div>

          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Emergency Operations Center
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink2">
            Monitor active incidents, department readiness and
            response performance across the network.
          </p>
        </div>

        <Link
          to="/admin/emergencies"
          className="btn-secondary w-fit"
        >
          View all incidents
          <ArrowUpRight
            size={14}
            strokeWidth={1.9}
          />
        </Link>
      </section>

      {/* Live notification */}
      {notification && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-brand-red/25 bg-brand-red/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Bell
              size={16}
              strokeWidth={1.9}
              className="flex-shrink-0 text-brand-red"
            />

            <span className="truncate text-sm text-brand-red2">
              {notification}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setNotification('')}
            className="rounded-md p-1 text-ink3 transition-colors hover:bg-bg3 hover:text-ink"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner
            size={28}
            className="text-brand-red"
          />
        </div>
      ) : (
        <>
          {/* Operations summary */}
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Activity
                size={16}
                strokeWidth={1.9}
                className="text-ink3"
              />

              <div>
                <h3 className="text-sm font-semibold text-ink">
                  Operations Summary
                </h3>

                <p className="mt-1 text-xs text-ink3">
                  Current network-wide emergency performance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Active Incidents"
                value={activeCount}
                color="text-brand-red2"
                sub={`${openCount} awaiting response`}
              />

              <StatCard
                label="Critical Cases"
                value={criticalCount}
                color="text-brand-amber"
                sub="Highest-priority reports"
              />

              <StatCard
                label="Average Response"
                value={
                  stats?.avgResponseTime !== undefined
                    ? `${Number(
                        stats.avgResponseTime
                      ).toFixed(1)}m`
                    : '—'
                }
                color="text-brand-blue"
                sub="Across accepted incidents"
              />

              <StatCard
                label="Resolution Rate"
                value={`${resolutionRate}%`}
                color="text-brand-green"
                sub={`${resolvedCount} incidents resolved`}
              />
            </div>
          </section>

          {/* Activity feed */}
          <section className="mb-8">
            <LiveActivityFeed activities={activities} />
          </section>

          {/* Department operations */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="font-display text-lg font-semibold text-ink">
                Department Operations
              </h2>

              <p className="mt-1 text-xs text-ink3">
                Emergency workload and responder availability by
                department
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {departmentStats.map((department) => {
                const meta =
                  DEPARTMENT_META[
                    department.department
                  ] || {
                    title:
                      department.department ||
                      'Response Unit',
                    icon: Activity,
                    path: '#',
                    accent: 'text-ink2',
                    surface: 'bg-bg3',
                  }

                const DepartmentIcon = meta.icon

                return (
                  <Link
                    key={department.department}
                    to={meta.path}
                    className="card group block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line2/30"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${meta.surface}`}
                        >
                          <DepartmentIcon
                            size={19}
                            strokeWidth={2}
                            className={meta.accent}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-ink">
                            {meta.title}
                          </h3>

                          <p className="mt-1 text-xs text-ink3">
                            {department.responders}{' '}
                            registered responder
                            {department.responders === 1
                              ? ''
                              : 's'}
                          </p>
                        </div>
                      </div>

                      <span className="font-display text-2xl font-semibold text-ink">
                        {department.totalEmergencies}
                      </span>
                    </div>

                    <div className="mb-5 grid grid-cols-3 divide-x divide-line/10 rounded-lg border border-line/10 bg-bg3">
                      <div className="p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-ink3">
                          Open
                        </p>

                        <p className="mt-1 text-lg font-semibold text-brand-amber">
                          {department.openEmergencies}
                        </p>
                      </div>

                      <div className="p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-ink3">
                          Active
                        </p>

                        <p className="mt-1 text-lg font-semibold text-brand-blue">
                          {
                            department.inProgressEmergencies
                          }
                        </p>
                      </div>

                      <div className="p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-ink3">
                          Resolved
                        </p>

                        <p className="mt-1 text-lg font-semibold text-brand-green">
                          {department.resolvedEmergencies}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink2 transition-colors group-hover:text-ink">
                      View department
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.9}
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Live map */}
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  Live Incident Map
                </h3>

                <p className="mt-1 text-xs text-ink3">
                  Location-based view of all reported emergencies
                </p>
              </div>

              <span className="text-xs font-medium text-ink3">
                {emergencies.length} reports
              </span>
            </div>

            <EmergencyMap emergencies={emergencies} />
          </section>

          {/* Analytics */}
          <section className="mb-8">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                Incident Analytics
              </h3>

              <p className="mt-1 text-xs text-ink3">
                Status and severity distribution across the
                network
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="card p-5">
                <h4 className="mb-4 text-sm font-semibold text-ink">
                  Incident Status
                </h4>

                <ResponsiveContainer
                  width="100%"
                  height={240}
                >
                  <BarChart data={statusBarData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(90,96,128,0.18)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#5a6080"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#5a6080"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                      itemStyle={{
                        color: '#ffffff',
                      }}
                    />

                    <Bar
                      dataKey="value"
                      radius={[5, 5, 0, 0]}
                    >
                      {statusBarData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-5">
                <h4 className="mb-4 text-sm font-semibold text-ink">
                  Severity Distribution
                </h4>

                {severityPieData.length === 0 ? (
                  <div className="flex h-[240px] items-center justify-center text-sm text-ink3">
                    No severity data available
                  </div>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={240}
                  >
                    <PieChart>
                      <Pie
                        data={severityPieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {severityPieData.map(
                          (entry) => (
                            <Cell
                              key={entry.key}
                              fill={
                                PIE_COLORS[
                                  entry.key
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={{
                          color: '#ffffff',
                          fontWeight: 600,
                        }}
                        itemStyle={{
                          color: '#ffffff',
                        }}
                      />

                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span
                            style={{
                              color: '#9aa0b8',
                              fontSize: 12,
                            }}
                          >
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </section>

          {/* Network participants */}
          <section>
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                Network Participants
              </h3>

              <p className="mt-1 text-xs text-ink3">
                Registered users supporting the emergency network
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                label="Registered Citizens"
                value={totalCitizens}
                color="text-brand-blue"
                sub="Users able to report incidents"
              />

              <StatCard
                label="Community Volunteers"
                value={totalVolunteers}
                color="text-brand-purple"
                sub="Registered community responders"
              />
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  )
}