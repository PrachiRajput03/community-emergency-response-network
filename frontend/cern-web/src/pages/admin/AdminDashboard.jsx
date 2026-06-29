import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as dashboardService from '../../services/dashboardService'
import { SEVERITY_META, STATUS_META } from '../../utils/constants'

const PIE_COLORS = {
  LOW: '#5a6080',
  MEDIUM: '#3d8bff',
  HIGH: '#ffb83f',
  CRITICAL: '#ff3b5c',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    dashboardService
      .getDashboardStats()
      .then((data) => mounted && setStats(data))
      .catch((err) => mounted && setError(err.response?.data?.message || 'Failed to load dashboard stats.'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  // Normalize backend response into chart-friendly shapes.
  // Adjust these field accessors to match your actual Spring Boot DTO.
  const totalEmergencies = stats?.totalEmergencies ?? 0
  const openCount = stats?.openEmergencies ?? 0
  const inProgressCount = stats?.inProgressEmergencies ?? 0
  const resolvedCount = stats?.resolvedEmergencies ?? 0
  const totalVolunteers = stats?.totalVolunteers ?? 0
  const totalCitizens = stats?.totalCitizens ?? 0

  const statusBarData = [
    { name: STATUS_META.OPEN.label, value: openCount, color: '#ffb83f' },
    { name: STATUS_META.IN_PROGRESS.label, value: inProgressCount, color: '#3d8bff' },
    { name: STATUS_META.RESOLVED.label, value: resolvedCount, color: '#22e56b' },
  ]

  const severityCounts = stats?.severityCounts || {}
  const severityPieData = Object.keys(SEVERITY_META)
    .map((key) => ({ name: SEVERITY_META[key].label, value: severityCounts[key] ?? 0, key }))
    .filter((d) => d.value > 0)

  return (
    <DashboardLayout title="Admin Dashboard">
      <p className="text-sm text-ink2 mb-6 lg:hidden">Live monitoring across the emergency response network</p>

      {error && <div className="mb-6"><ErrorAlert message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={28} className="text-brand-red" /></div>
      ) : (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="🚨" label="Total Emergencies" value={totalEmergencies} color="text-ink" />
            <StatCard icon="⏳" label="In Progress" value={inProgressCount} color="text-brand-blue" />
            <StatCard icon="✅" label="Resolved" value={resolvedCount} color="text-brand-green" />
            <StatCard icon="🦺" label="Volunteers" value={totalVolunteers} color="text-brand-purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Status bar chart */}
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-ink mb-4">Emergencies by Status</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={statusBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" stroke="#5a6080" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#5a6080" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#161c2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#eef0f6' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {statusBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Severity pie chart */}
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-ink mb-4">Severity Breakdown</h3>
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
                        <Cell key={entry.key} fill={PIE_COLORS[entry.key]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#161c2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span style={{ color: '#9aa0b8', fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard icon="🆘" label="Total Citizens" value={totalCitizens} color="text-brand-blue" />
            <StatCard
              icon="⚡"
              label="Avg Response Time"
              value={stats?.avgResponseTime ? `${stats.avgResponseTime}m` : '—'}
              color="text-brand-amber"
            />
            <StatCard
              icon="📈"
              label="Resolution Rate"
              value={totalEmergencies > 0 ? `${Math.round((resolvedCount / totalEmergencies) * 100)}%` : '—'}
              color="text-brand-green"
            />
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
