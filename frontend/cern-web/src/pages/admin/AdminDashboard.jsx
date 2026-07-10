import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
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

import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import EmergencyMap from '../../components/EmergencyMap'

import * as dashboardService from '../../services/dashboardService'
import * as emergencyService from '../../services/emergencyService'

import { SEVERITY_META, STATUS_META } from '../../utils/constants'

const PIE_COLORS = {
  LOW: '#5a6080',
  MEDIUM: '#3d8bff',
  HIGH: '#ffb83f',
  CRITICAL: '#ff3b5c',
}

const DEPARTMENT_META = {
  MEDICAL: {
    title: 'Medical Department',
    icon: '🚑',
    path: '/admin/departments/medical',
  },
  FIRE: {
    title: 'Fire Department',
    icon: '🚒',
    path: '/admin/departments/fire',
  },
  POLICE: {
    title: 'Police Department',
    icon: '👮',
    path: '/admin/departments/police',
  },
  COMMUNITY: {
    title: 'Community Response',
    icon: '🦺',
    path: '/admin/departments/community',
  },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    Promise.all([
      dashboardService.getDashboardStats(),
      emergencyService.getAllEmergencies(),
    ])
      .then(([statsData, emergenciesData]) => {
        if (!mounted) return

        setStats(statsData)

        setEmergencies(
          Array.isArray(emergenciesData)
            ? emergenciesData
            : emergenciesData?.content || []
        )
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load dashboard data.'
          )
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const totalEmergencies = stats?.totalEmergencies ?? 0
  const openCount = stats?.openEmergencies ?? 0
  const inProgressCount = stats?.inProgressEmergencies ?? 0
  const resolvedCount = stats?.resolvedEmergencies ?? 0
  const totalVolunteers = stats?.totalVolunteers ?? 0
  const totalCitizens = stats?.totalCitizens ?? 0
  const departmentStats = stats?.departmentStats || []

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

  return (
    <DashboardLayout title="Admin Dashboard">
      <p className="text-sm text-ink2 mb-6 lg:hidden">
        Live monitoring across the emergency response network
      </p>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} className="text-brand-red" />
        </div>
      ) : (
        <>
          {/* Top statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon="🚨"
              label="Total Emergencies"
              value={totalEmergencies}
              color="text-ink"
            />

            <StatCard
              icon="⏳"
              label="In Progress"
              value={inProgressCount}
              color="text-brand-blue"
            />

            <StatCard
              icon="✅"
              label="Resolved"
              value={resolvedCount}
              color="text-brand-green"
            />

            <StatCard
              icon="🦺"
              label="Volunteers"
              value={totalVolunteers}
              color="text-brand-purple"
            />
          </div>

          {/* Department overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-ink">
                  Department Overview
                </h2>

                <p className="text-xs text-ink3 mt-1">
                  Department-wise emergency and responder statistics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departmentStats.map((department) => {
                const meta = DEPARTMENT_META[department.department] || {
                  title: department.department,
                  icon: '🚨',
                  path: '#',
                }

                return (
                  <Link
                    key={department.department}
                    to={meta.path}
                    className="card p-5 block hover:border-brand-red/60 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-bg3 flex items-center justify-center text-2xl">
                          {meta.icon}
                        </div>

                        <div>
                          <h3 className="font-semibold text-ink">
                            {meta.title}
                          </h3>

                          <p className="text-xs text-ink3 mt-1">
                            {department.responders} registered responder
                            {department.responders === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>

                      <span className="text-2xl font-display font-bold text-ink">
                        {department.totalEmergencies}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="rounded-xl bg-bg3 p-3">
                        <p className="text-[11px] text-ink3">
                          Open
                        </p>

                        <p className="text-lg font-semibold text-brand-amber mt-1">
                          {department.openEmergencies}
                        </p>
                      </div>

                      <div className="rounded-xl bg-bg3 p-3">
                        <p className="text-[11px] text-ink3">
                          In Progress
                        </p>

                        <p className="text-lg font-semibold text-brand-blue mt-1">
                          {department.inProgressEmergencies}
                        </p>
                      </div>

                      <div className="rounded-xl bg-bg3 p-3">
                        <p className="text-[11px] text-ink3">
                          Resolved
                        </p>

                        <p className="text-lg font-semibold text-brand-green mt-1">
                          {department.resolvedEmergencies}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-red2">
                      View Department Details
                      <span>→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-ink mb-4">
                Emergencies by Status
              </h3>

              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={statusBarData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
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
                    contentStyle={{
                      background: '#161c2a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#eef0f6' }}
                  />

                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {statusBarData.map((entry, index) => (
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
              <h3 className="font-semibold text-sm text-ink mb-4">
                Severity Breakdown
              </h3>

              {severityPieData.length === 0 ? (
                <div className="h-[240px] flex items-center justify-center text-sm text-ink3">
                  No severity data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={severityPieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {severityPieData.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={PIE_COLORS[entry.key]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: '#161c2a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        fontSize: 12,
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

          {/* Emergency map */}
          <div className="card p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm text-ink">
                  Emergency Map
                </h3>

                <p className="text-xs text-ink3 mt-1">
                  Location-based view of reported emergencies
                </p>
              </div>

              <span className="text-xs text-ink3">
                {emergencies.length} reports
              </span>
            </div>

            <EmergencyMap emergencies={emergencies} />
          </div>

          {/* Secondary statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              icon="🆘"
              label="Total Citizens"
              value={totalCitizens}
              color="text-brand-blue"
            />

            <StatCard
              icon="⚡"
              label="Avg Response Time"
              value={
                stats?.avgResponseTime !== undefined
                  ? `${Number(stats.avgResponseTime).toFixed(1)}m`
                  : '—'
              }
              color="text-brand-amber"
            />

            <StatCard
              icon="📈"
              label="Resolution Rate"
              value={
                totalEmergencies > 0
                  ? `${Math.round(
                      (resolvedCount / totalEmergencies) * 100
                    )}%`
                  : '—'
              }
              color="text-brand-green"
            />
          </div>
        </>
      )}
    </DashboardLayout>
  )
}