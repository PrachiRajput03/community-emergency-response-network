import {
  exportEmergenciesToCSV,
  exportEmergenciesToPDF,
} from '../../utils/exportEmergencyReports'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import EmergencyMap from '../../components/EmergencyMap'
import EmergencyCard from '../../components/EmergencyCard'
import StatCard from '../../components/StatCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import * as dashboardService from '../../services/dashboardService'
import { EMERGENCY_STATUS } from '../../utils/constants'

const DEPARTMENT_CONFIG = {
  medical: {
    key: 'MEDICAL',
    title: 'Medical Department',
    icon: '🚑',
    fetcher: emergencyService.getMedicalEmergencies,
  },
  fire: {
    key: 'FIRE',
    title: 'Fire Department',
    icon: '🚒',
    fetcher: emergencyService.getFireEmergencies,
  },
  police: {
    key: 'POLICE',
    title: 'Police Department',
    icon: '👮',
    fetcher: emergencyService.getPoliceEmergencies,
  },
  community: {
    key: 'COMMUNITY',
    title: 'Community Response',
    icon: '🦺',
    fetcher: emergencyService.getVolunteerEmergencies,
  },
}

export default function DepartmentDetailsPage({ type }) {
  const config = DEPARTMENT_CONFIG[type]

  const [emergencies, setEmergencies] = useState([])
  const [departmentStats, setDepartmentStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const reportTitle = `${config?.title || 'Department'} Emergency Report`

  useEffect(() => {
    if (!config) {
      setLoading(false)
      return
    }

    let mounted = true

    Promise.all([
      config.fetcher(),
      dashboardService.getDashboardStats(),
    ])
      .then(([emergencyData, statsData]) => {
        if (!mounted) return

        const emergencyList = Array.isArray(emergencyData)
          ? emergencyData
          : emergencyData?.content || []

        const stats =
          statsData?.departmentStats?.find(
            (item) => item.department === config.key
          ) || null

        setEmergencies(emergencyList)
        setDepartmentStats(stats)
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load department details.'
          )
        }
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [type])

  const openEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) => emergency.status === EMERGENCY_STATUS.OPEN
      ),
    [emergencies]
  )

  const inProgressEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.status === EMERGENCY_STATUS.IN_PROGRESS
      ),
    [emergencies]
  )

  const resolvedEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.status === EMERGENCY_STATUS.RESOLVED
      ),
    [emergencies]
  )

  if (!config) {
    return (
      <DashboardLayout title="Department">
        <ErrorAlert message="Invalid department type." />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={config.title}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-bg3 flex items-center justify-center text-2xl">
            {config.icon}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              {config.title}
            </h2>
            <p className="text-sm text-ink2">
              Department-wide emergencies and responder statistics
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
  <button
    type="button"
    onClick={() =>
      exportEmergenciesToCSV(emergencies, reportTitle)
    }
    disabled={emergencies.length === 0}
    className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <span>📥</span>
    Export CSV
  </button>

  <button
    type="button"
    onClick={() =>
      exportEmergenciesToPDF(emergencies, reportTitle)
    }
    disabled={emergencies.length === 0}
    className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
  >
    <span>📄</span>
    Export PDF
  </button>

  <Link
    to="/admin/dashboard"
    className="text-xs font-semibold text-brand-red2 hover:underline"
  >
    ← Back to Dashboard
  </Link>
</div>
      </div>

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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon="🚨"
              label="Total Cases"
              value={departmentStats?.totalEmergencies ?? emergencies.length}
              color="text-ink"
            />

            <StatCard
              icon="🟠"
              label="Open"
              value={departmentStats?.openEmergencies ?? openEmergencies.length}
              color="text-brand-amber"
            />

            <StatCard
              icon="⏳"
              label="In Progress"
              value={
                departmentStats?.inProgressEmergencies ??
                inProgressEmergencies.length
              }
              color="text-brand-blue"
            />

            <StatCard
              icon="✅"
              label="Resolved"
              value={
                departmentStats?.resolvedEmergencies ??
                resolvedEmergencies.length
              }
              color="text-brand-green"
            />

            <StatCard
              icon="👥"
              label="Responders"
              value={departmentStats?.responders ?? 0}
              color="text-brand-purple"
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-ink">
                  Department Emergency Map
                </h3>
                <p className="text-xs text-ink3 mt-1">
                  Location view filtered for this department
                </p>
              </div>

              <span className="text-xs text-ink3">
                {emergencies.length} cases
              </span>
            </div>

            <EmergencyMap emergencies={emergencies} />
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-ink mb-4">
              Open Emergencies
            </h3>

            {openEmergencies.length === 0 ? (
              <div className="card p-8 text-center">
                <span className="text-3xl block mb-3">🎉</span>
                <p className="text-sm text-ink2">
                  No open emergencies for this department.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {openEmergencies.map((emergency) => (
                  <EmergencyCard
                    key={emergency.id}
                    emergency={emergency}
                  />
                ))}
              </div>
            )}
          </div>

          {inProgressEmergencies.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-ink mb-4">
                In Progress
              </h3>

              <div className="space-y-3">
                {inProgressEmergencies.map((emergency) => (
                  <EmergencyCard
                    key={emergency.id}
                    emergency={emergency}
                  />
                ))}
              </div>
            </div>
          )}

          {resolvedEmergencies.length > 0 && (
            <div>
              <h3 className="font-semibold text-ink mb-4">
                Recently Resolved
              </h3>

              <div className="space-y-3">
                {resolvedEmergencies.slice(0, 5).map((emergency) => (
                  <EmergencyCard
                    key={emergency.id}
                    emergency={emergency}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}