import { useEffect, useMemo, useState } from 'react'
import {
  Ambulance,
  CheckCircle2,
  Download,
  FileText,
  Flame,
  MapPinned,
  Radio,
  Shield,
} from 'lucide-react'

import {
  connectEmergencySocket,
  disconnectEmergencySocket,
} from '../../services/websocketService'
import {
  exportEmergenciesToCSV,
  exportEmergenciesToPDF,
} from '../../utils/exportEmergencyReports'

import DashboardLayout from '../../components/DashboardLayout'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import StatCard from '../../components/StatCard'
import EmergencyMap from '../../components/EmergencyMap'

import * as emergencyService from '../../services/emergencyService'
import { EMERGENCY_STATUS } from '../../utils/constants'

const CONFIG = {
  medical: {
    title: 'Medical Operations',
    label: 'Medical incidents',
    icon: Ambulance,
    accent: 'text-brand-blue',
    surface: 'bg-brand-blue/10',
    fetcher: emergencyService.getMedicalEmergencies,
  },

  fire: {
    title: 'Fire Operations',
    label: 'Fire incidents',
    icon: Flame,
    accent: 'text-brand-red',
    surface: 'bg-brand-red/10',
    fetcher: emergencyService.getFireEmergencies,
  },

  police: {
    title: 'Police Operations',
    label: 'Police incidents',
    icon: Shield,
    accent: 'text-brand-purple',
    surface: 'bg-brand-purple/10',
    fetcher: emergencyService.getPoliceEmergencies,
  },
}

export default function ResponderDashboard({ type }) {
  const config = CONFIG[type]
  const ResponderIcon = config?.icon

  const [emergencies, setEmergencies] = useState([])
  const [activeMissions, setActiveMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')
  const [acceptingId, setAcceptingId] = useState(null)
  const [resolvingId, setResolvingId] = useState(null)

  const reportTitle = `${
    config?.title || 'Responder'
  } Emergency Report`

  const loadData = () => {
    if (!config) return

    setLoading(true)
    setError('')

    Promise.all([
      config.fetcher(),
      emergencyService.getMyActiveMissions(),
    ])
      .then(([emergencyData, activeData]) => {
        setEmergencies(
          Array.isArray(emergencyData)
            ? emergencyData
            : emergencyData?.content || []
        )

        setActiveMissions(
          Array.isArray(activeData)
            ? activeData
            : activeData?.content || []
        )
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            'Failed to load responder emergencies.'
        )
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [type])

  useEffect(() => {
    if (!config) return undefined

    connectEmergencySocket(type, (emergency) => {
  const status = emergency.status || 'UPDATED'

  const action =
    status === EMERGENCY_STATUS.OPEN
      ? 'New incident received'
      : status === EMERGENCY_STATUS.IN_PROGRESS
        ? 'Incident accepted'
        : status === EMERGENCY_STATUS.RESOLVED
          ? 'Incident resolved'
          : 'Incident updated'

  setNotification(
    `${action}: ${emergency.title || 'Emergency'}`
  )

  loadData()

  setTimeout(() => {
    setNotification('')
  }, 10000)
})

    return () => {
      disconnectEmergencySocket()
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

  const activeEmergencies = activeMissions

  const resolvedEmergencies = useMemo(
    () =>
      emergencies.filter(
        (emergency) =>
          emergency.status === EMERGENCY_STATUS.RESOLVED
      ),
    [emergencies]
  )

  const mapEmergencies = useMemo(
    () => [...openEmergencies, ...activeEmergencies],
    [openEmergencies, activeEmergencies]
  )

  const handleAccept = async (id) => {
    setAcceptingId(id)
    setError('')

    try {
      await emergencyService.acceptEmergency(id)
      loadData()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to accept emergency.'
      )
    } finally {
      setAcceptingId(null)
    }
  }

  const handleResolve = async (id) => {
    setResolvingId(id)
    setError('')

    try {
      await emergencyService.resolveEmergency(id)
      loadData()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to resolve emergency.'
      )
    } finally {
      setResolvingId(null)
    }
  }

  if (!config) {
    return (
      <DashboardLayout title="Responder Dashboard">
        <ErrorAlert message="Invalid responder dashboard type." />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={config.title}>
      {/* Operations header */}
      <section className="mb-8 flex flex-col gap-5 border-b border-line/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${config.surface}`}
          >
            <ResponderIcon
              size={20}
              strokeWidth={2}
              className={config.accent}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Radio
                size={13}
                strokeWidth={2}
                className="text-brand-green"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-green">
                Live dispatch
              </span>
            </div>

            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              {config.title}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-ink2">
              Monitor incoming {config.label.toLowerCase()}, manage active
              missions and update incident status in real time.
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
        </div>
      </section>

      {notification && (
  <div className="mb-6 flex items-center justify-between rounded-lg border border-brand-blue/25 bg-brand-blue/10 px-4 py-3">
    <span className="text-sm text-brand-blue">
      {notification}
    </span>

    <button
      type="button"
      onClick={() => setNotification('')}
      className="text-xs font-medium text-ink3 transition-colors hover:text-ink"
    >
      Dismiss
    </button>
  </div>
)}

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {/* Operations summary */}
      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-ink">
            Dispatch Summary
          </h3>

          <p className="mt-1 text-xs text-ink3">
            Current workload for this response unit
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            label="Incoming"
            value={
              loading ? '—' : openEmergencies.length
            }
            color="text-brand-amber"
            sub="Awaiting acceptance"
          />

          <StatCard
            label="Active Missions"
            value={
              loading ? '—' : activeEmergencies.length
            }
            color="text-brand-blue"
            sub="Response underway"
          />

          <StatCard
            label="Resolved"
            value={
              loading ? '—' : resolvedEmergencies.length
            }
            color="text-brand-green"
            sub="Completed incidents"
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
                Live Incident Map
              </h3>
            </div>

            <p className="text-xs text-ink3">
              Open and active incidents assigned to this unit
            </p>
          </div>

          <span className="text-xs font-medium text-ink3">
            {mapEmergencies.length} visible
          </span>
        </div>

        <EmergencyMap emergencies={mapEmergencies} />
      </section>

      {/* Active missions */}
      {activeEmergencies.length > 0 && (
        <section className="mb-8">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-ink">
              Active Missions
            </h3>

            <p className="mt-1 text-xs text-ink3">
              Incidents currently being handled by this responder
            </p>
          </div>

          <div className="space-y-3">
            {activeEmergencies.map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
                actions={
                  <button
                    type="button"
                    onClick={() =>
                      handleResolve(emergency.id)
                    }
                    disabled={resolvingId === emergency.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#1dd05f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resolvingId === emergency.id ? (
                      <Spinner size={12} />
                    ) : (
                      <>
                        <CheckCircle2
                          size={14}
                          strokeWidth={2}
                        />
                        Mark Resolved
                      </>
                    )}
                  </button>
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Incoming requests */}
      <section>
        <div className="mb-4">
          <h3 className="font-display text-lg font-semibold text-ink">
            Incoming Requests
          </h3>

          <p className="mt-1 text-xs text-ink3">
            New incidents available for this response unit
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner
              size={28}
              className="text-brand-red"
            />
          </div>
        ) : openEmergencies.length === 0 ? (
          <div className="card px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-bg3">
              <CheckCircle2
                size={22}
                strokeWidth={1.8}
                className="text-brand-green"
              />
            </div>

            <h3 className="font-display text-base font-semibold text-ink">
              Dispatch queue is clear
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink2">
              There are no unassigned incidents for this response unit right
              now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {openEmergencies.map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
                actions={
                  <button
                    type="button"
                    onClick={() =>
                      handleAccept(emergency.id)
                    }
                    disabled={acceptingId === emergency.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#1dd05f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {acceptingId === emergency.id ? (
                      <Spinner size={12} />
                    ) : (
                      <>
                        <CheckCircle2
                          size={14}
                          strokeWidth={2}
                        />
                        Accept Incident
                      </>
                    )}
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}