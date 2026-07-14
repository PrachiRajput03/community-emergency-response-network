import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react'

import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../context/AuthContext'
import * as emergencyService from '../../services/emergencyService'
import {
  connectEmergencySocket,
  disconnectEmergencySocket,
} from '../../services/websocketService'
import { EMERGENCY_STATUS } from '../../utils/constants'

export default function VolunteerDashboard() {
  const { user } = useAuth()

  const [openEmergencies, setOpenEmergencies] = useState([])
  const [assigned, setAssigned] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [acceptingId, setAcceptingId] = useState(null)
  const [notification, setNotification] = useState('')

  const loadData = () => {
    setLoading(true)
    setError('')

    Promise.all([
      emergencyService.getEmergenciesByStatus(
        EMERGENCY_STATUS.OPEN
      ),
      emergencyService.getMyAssignedEmergencies(),
    ])
      .then(([openData, assignedData]) => {
        setOpenEmergencies(
          Array.isArray(openData)
            ? openData
            : openData?.content || []
        )

        setAssigned(
          Array.isArray(assignedData)
            ? assignedData
            : assignedData?.content || []
        )
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            'Failed to load emergency data.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()

    connectEmergencySocket('community', (emergency) => {
      const status = emergency.status || 'UPDATED'

      const action =
        status === EMERGENCY_STATUS.OPEN
          ? 'New emergency reported'
          : status === EMERGENCY_STATUS.IN_PROGRESS
            ? 'Emergency accepted'
            : status === EMERGENCY_STATUS.RESOLVED
              ? 'Emergency resolved'
              : 'Emergency updated'

      setNotification(
        `${action}: ${emergency.title || 'Emergency'}`
      )

      if (
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        const notificationTitle =
          status === EMERGENCY_STATUS.OPEN
            ? 'New Community Emergency'
            : status === EMERGENCY_STATUS.IN_PROGRESS
              ? 'Emergency Accepted'
              : status === EMERGENCY_STATUS.RESOLVED
                ? 'Emergency Resolved'
                : 'Emergency Updated'

        new Notification(notificationTitle, {
          body: `${emergency.title || 'Emergency'}\n${
            emergency.location || 'Location unavailable'
          }`,
          icon: '/logo.png',
        })
      }

      loadData()

      setTimeout(() => {
        setNotification('')
      }, 10000)
    })

    return () => {
      disconnectEmergencySocket()
    }
  }, [])

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

  const activeAssigned = assigned.filter(
    (emergency) =>
      emergency.status === EMERGENCY_STATUS.IN_PROGRESS
  )

  const resolvedCount = assigned.filter(
    (emergency) =>
      emergency.status === EMERGENCY_STATUS.RESOLVED
  ).length

  return (
    <DashboardLayout title="Dashboard">
      {/* Header */}
      <section className="mb-8 flex flex-col gap-5 border-b border-line/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink3">
            Community Response
          </p>

          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
            Welcome back, {user?.name || 'Volunteer'}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-ink2">
            Monitor nearby emergencies and assist citizens requiring immediate
            community support.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-xs font-semibold text-brand-green sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-green" />
          AVAILABLE FOR RESPONSE
        </div>
      </section>

      {/* Notification */}
      {notification && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-red2">
          <div className="flex items-center gap-2">
            <Bell
              size={16}
              strokeWidth={1.9}
              className="text-brand-red"
            />

            <span>{notification}</span>
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

      {/* Stats */}
      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-ink">
            Response Summary
          </h3>

          <p className="mt-1 text-xs text-ink3">
            Current community response workload
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Open Requests"
            value={
              loading ? '—' : openEmergencies.length
            }
            color="text-brand-amber"
            sub="Available for response"
          />

          <StatCard
            label="Active Missions"
            value={
              loading ? '—' : activeAssigned.length
            }
            color="text-brand-blue"
            sub="Currently assigned"
          />

          <StatCard
            label="Resolved"
            value={
              loading ? '—' : resolvedCount
            }
            color="text-brand-green"
            sub="Completed missions"
          />
        </div>
      </section>

      {/* Active missions */}
      {activeAssigned.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <HeartHandshake
                  size={18}
                  strokeWidth={1.9}
                  className="text-brand-blue"
                />
                Active Missions
              </h2>

              <p className="mt-1 text-xs text-ink3">
                Emergencies currently assigned to you
              </p>
            </div>

            <Link
              to="/volunteer/assigned"
              className="text-xs font-semibold text-ink2 transition-colors hover:text-ink"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {activeAssigned.map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
              />
            ))}
          </div>
        </section>
      )}

      {/* Incoming requests */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <ShieldCheck
                size={18}
                strokeWidth={1.9}
                className="text-brand-red"
              />
              Incoming Requests
            </h2>

            <p className="mt-1 text-xs text-ink3">
              Community emergencies available for acceptance
            </p>
          </div>

          <span className="text-xs font-medium text-ink3">
            {openEmergencies.length} available
          </span>
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
                size={23}
                strokeWidth={1.8}
                className="text-brand-green"
              />
            </div>

            <h3 className="font-display text-base font-semibold text-ink">
              Response queue is clear
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink2">
              There are no open community emergencies right now. Stay available
              for the next request.
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
                    disabled={
                      acceptingId === emergency.id
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#1dd05f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {acceptingId === emergency.id ? (
                      <Spinner size={12} />
                    ) : (
                      <>
                        <UserCheck
                          size={14}
                          strokeWidth={2}
                        />
                        Accept
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