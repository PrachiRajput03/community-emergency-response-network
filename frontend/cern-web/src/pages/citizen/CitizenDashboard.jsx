import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FileText,
  Plus,
} from 'lucide-react'

import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_STATUS } from '../../utils/constants'

export default function CitizenDashboard() {
  const { user } = useAuth()

  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError('')

    emergencyService
      .getMyEmergencies()
      .then((data) => {
        if (!mounted) return

        setEmergencies(
          Array.isArray(data)
            ? data
            : data?.content || []
        )
      })
      .catch((err) => {
        if (!mounted) return

        setError(
          err.response?.data?.message ||
            'Failed to load your emergencies.'
        )
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const openEmergencies = emergencies.filter(
    (emergency) =>
      emergency.status === EMERGENCY_STATUS.OPEN
  )

  const inProgressEmergencies = emergencies.filter(
    (emergency) =>
      emergency.status === EMERGENCY_STATUS.IN_PROGRESS
  )

  const resolvedEmergencies = emergencies.filter(
    (emergency) =>
      emergency.status === EMERGENCY_STATUS.RESOLVED
  )

  const recentEmergencies = [...emergencies]
    .sort(
      (first, second) =>
        new Date(second.createdAt || 0) -
        new Date(first.createdAt || 0)
    )
    .slice(0, 5)

  return (
    <DashboardLayout title="Dashboard">
      {/* Page introduction */}
      <section className="mb-8 flex flex-col gap-5 border-b border-line/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">
            Citizen portal
          </p>

          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
            Welcome back, {user?.name || 'Citizen'}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-ink2">
            Report incidents, follow live status updates and review your recent
            emergency requests.
          </p>
        </div>

        <Link
          to="/citizen/create"
          className="btn-primary hidden sm:inline-flex"
        >
          <Plus size={17} strokeWidth={2} />
          Report Emergency
        </Link>
      </section>

      {/* Mobile primary action */}
      <Link
        to="/citizen/create"
        className="mb-6 flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e53355] sm:hidden"
      >
        <Plus size={17} strokeWidth={2} />
        Report Emergency
      </Link>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {/* Reporting summary */}
      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-ink">
            Reporting Summary
          </h3>

          <p className="mt-1 text-xs text-ink3">
            Current status of all emergencies you have reported
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Reports"
            value={loading ? '—' : emergencies.length}
            color="text-ink"
            sub="All submitted incidents"
          />

          <StatCard
            label="Open"
            value={loading ? '—' : openEmergencies.length}
            color="text-brand-amber"
            sub="Awaiting acceptance"
          />

          <StatCard
            label="In Progress"
            value={loading ? '—' : inProgressEmergencies.length}
            color="text-brand-blue"
            sub="Response underway"
          />

          <StatCard
            label="Resolved"
            value={loading ? '—' : resolvedEmergencies.length}
            color="text-brand-green"
            sub="Completed incidents"
          />
        </div>
      </section>

      {/* Recent reports header */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              Recent Reports
            </h3>

            <p className="mt-1 text-xs text-ink3">
              Your latest emergency requests and their current status
            </p>
          </div>

          <Link
            to="/citizen/my-emergencies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink2 transition-colors hover:text-ink"
          >
            View all
            <ArrowUpRight size={13} strokeWidth={1.9} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner
              size={28}
              className="text-brand-red"
            />
          </div>
        ) : recentEmergencies.length === 0 ? (
          <div className="card px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-bg3">
              <FileText
                size={22}
                strokeWidth={1.8}
                className="text-ink3"
              />
            </div>

            <h3 className="font-display text-base font-semibold text-ink">
              No reports yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink2">
              Once you report an emergency, it will appear here with live
              updates from the response team.
            </p>

            <Link
              to="/citizen/create"
              className="btn-primary mt-6 inline-flex"
            >
              <Plus size={17} strokeWidth={2} />
              Report Your First Emergency
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEmergencies.map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
              />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}