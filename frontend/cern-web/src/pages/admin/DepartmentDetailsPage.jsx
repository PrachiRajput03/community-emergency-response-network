import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Ambulance,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Flame,
  HeartHandshake,
  MapPinned,
  Shield,
} from 'lucide-react'

import {
  exportEmergenciesToCSV,
  exportEmergenciesToPDF,
} from '../../utils/exportEmergencyReports'

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
    title: 'Medical Operations',
    icon: Ambulance,
    accent: 'text-brand-blue',
    surface: 'bg-brand-blue/10',
    fetcher: emergencyService.getMedicalEmergencies,
  },

  fire: {
    key: 'FIRE',
    title: 'Fire Operations',
    icon: Flame,
    accent: 'text-brand-red',
    surface: 'bg-brand-red/10',
    fetcher: emergencyService.getFireEmergencies,
  },

  police: {
    key: 'POLICE',
    title: 'Police Operations',
    icon: Shield,
    accent: 'text-brand-purple',
    surface: 'bg-brand-purple/10',
    fetcher: emergencyService.getPoliceEmergencies,
  },

  community: {
    key: 'COMMUNITY',
    title: 'Community Operations',
    icon: HeartHandshake,
    accent: 'text-brand-green',
    surface: 'bg-brand-green/10',
    fetcher: emergencyService.getVolunteerEmergencies,
  },
}

export default function DepartmentDetailsPage({ type }) {
  const config = DEPARTMENT_CONFIG[type]
  const DepartmentIcon = config?.icon

  const [emergencies, setEmergencies] = useState([])
  const [departmentStats, setDepartmentStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reportTitle = `${
    config?.title || 'Department'
  } Emergency Report`

  useEffect(() => {
    if (!config) {
      setLoading(false)
      return
    }

    let mounted = true

    setLoading(true)
    setError('')

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
        if (!mounted) return

        setError(
          err.response?.data?.message ||
            'Failed to load department details.'
        )
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [type])

  const openEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.status === EMERGENCY_STATUS.OPEN
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
      {/* Page header */}
      <section className="mb-8 flex flex-col gap-5 border-b border-line/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${config.surface}`}
          >
            <DepartmentIcon
              size={20}
              strokeWidth={2}
              className={config.accent}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink3">
              Admin Operations
            </p>

            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
              {config.title}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-ink2">
              Monitor incidents, department workload and responder activity
              from one operational view.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              exportEmergenciesToCSV(
                emergencies,
                reportTitle
              )
            }
            disabled={emergencies.length === 0}
            className="btn-secondary"
          >
            <Download size={15} strokeWidth={1.9} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() =>
              exportEmergenciesToPDF(
                emergencies,
                reportTitle
              )
            }
            disabled={emergencies.length === 0}
            className="btn-secondary"
          >
            <FileText size={15} strokeWidth={1.9} />
            Export PDF
          </button>

          <Link
            to="/admin/dashboard"
            className="btn-secondary"
          >
            <ArrowLeft size={15} strokeWidth={1.9} />
            Dashboard
          </Link>
        </div>
      </section>

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
          {/* Department summary */}
          <section className="mb-8">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-ink">
                Department Summary
              </h3>

              <p className="mt-1 text-xs text-ink3">
                Current workload and responder capacity
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              <StatCard
                label="Total Cases"
                value={
                  departmentStats?.totalEmergencies ??
                  emergencies.length
                }
                color="text-ink"
                sub="All department incidents"
              />

              <StatCard
                label="Open"
                value={
                  departmentStats?.openEmergencies ??
                  openEmergencies.length
                }
                color="text-brand-amber"
                sub="Awaiting response"
              />

              <StatCard
                label="In Progress"
                value={
                  departmentStats?.inProgressEmergencies ??
                  inProgressEmergencies.length
                }
                color="text-brand-blue"
                sub="Currently active"
              />

              <StatCard
                label="Resolved"
                value={
                  departmentStats?.resolvedEmergencies ??
                  resolvedEmergencies.length
                }
                color="text-brand-green"
                sub="Completed incidents"
              />

              <StatCard
                label="Responders"
                value={departmentStats?.responders ?? 0}
                color="text-brand-purple"
                sub="Registered personnel"
              />
            </div>
          </section>

          {/* Map */}
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MapPinned
                    size={15}
                    strokeWidth={1.9}
                    className="text-ink3"
                  />

                  <h3 className="text-sm font-semibold text-ink">
                    Department Incident Map
                  </h3>
                </div>

                <p className="text-xs text-ink3">
                  Location view filtered for this department
                </p>
              </div>

              <span className="text-xs font-medium text-ink3">
                {emergencies.length} cases
              </span>
            </div>

            <EmergencyMap emergencies={emergencies} />
          </section>

          {/* In progress */}
          {inProgressEmergencies.length > 0 && (
            <section className="mb-8">
              <div className="mb-4">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Active Incidents
                </h3>

                <p className="mt-1 text-xs text-ink3">
                  Emergencies currently being handled
                </p>
              </div>

              <div className="space-y-3">
                {inProgressEmergencies.map((emergency) => (
                  <EmergencyCard
                    key={emergency.id}
                    emergency={emergency}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Open emergencies */}
          <section className="mb-8">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                Open Emergencies
              </h3>

              <p className="mt-1 text-xs text-ink3">
                Incidents waiting for department response
              </p>
            </div>

            {openEmergencies.length === 0 ? (
              <div className="card px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-bg3">
                  <CheckCircle2
                    size={23}
                    strokeWidth={1.8}
                    className="text-brand-green"
                  />
                </div>

                <h3 className="font-display text-base font-semibold text-ink">
                  No open incidents
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink2">
                  There are no unresolved emergencies for this department
                  right now.
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
          </section>

          {/* Recently resolved */}
          {resolvedEmergencies.length > 0 && (
            <section>
              <div className="mb-4">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Recently Resolved
                </h3>

                <p className="mt-1 text-xs text-ink3">
                  Latest completed incidents from this department
                </p>
              </div>

              <div className="space-y-3">
                {resolvedEmergencies
                  .slice(0, 5)
                  .map((emergency) => (
                    <EmergencyCard
                      key={emergency.id}
                      emergency={emergency}
                    />
                  ))}
              </div>
            </section>
          )}
        </>
      )}
    </DashboardLayout>
  )
}