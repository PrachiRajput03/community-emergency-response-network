import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import EmergencyCard from '../../components/EmergencyCard'
import ErrorAlert from '../../components/ErrorAlert'
import Spinner from '../../components/Spinner'
import * as emergencyService from '../../services/emergencyService'
import {
  EMERGENCY_STATUS,
  SEVERITY,
  STATUS_META,
  SEVERITY_META,
} from '../../utils/constants'

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Status' },
  { key: EMERGENCY_STATUS.OPEN, label: STATUS_META.OPEN.label },
  {
    key: EMERGENCY_STATUS.IN_PROGRESS,
    label: STATUS_META.IN_PROGRESS.label,
  },
  {
    key: EMERGENCY_STATUS.RESOLVED,
    label: STATUS_META.RESOLVED.label,
  },
]

const SEVERITY_FILTERS = [
  { key: 'ALL', label: 'All Severity' },
  { key: SEVERITY.CRITICAL, label: SEVERITY_META.CRITICAL.label },
  { key: SEVERITY.HIGH, label: SEVERITY_META.HIGH.label },
  { key: SEVERITY.MEDIUM, label: SEVERITY_META.MEDIUM.label },
  { key: SEVERITY.LOW, label: SEVERITY_META.LOW.label },
]

export default function AllEmergenciesPage() {
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true

    setLoading(true)

    emergencyService
      .getAllEmergencies()
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
            'Failed to load emergencies.'
        )
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    let result = [...emergencies].sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )

    if (statusFilter !== 'ALL') {
      result = result.filter(
        (emergency) => emergency.status === statusFilter
      )
    }

    if (severityFilter !== 'ALL') {
      result = result.filter(
        (emergency) => emergency.severity === severityFilter
      )
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase()

      result = result.filter((emergency) =>
        [
          emergency.title,
          emergency.category,
          emergency.location,
          emergency.description,
          emergency.createdBy?.name,
          emergency.assignedVolunteer?.name,
        ].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query)
        )
      )
    }

    return result
  }, [
    emergencies,
    statusFilter,
    severityFilter,
    search,
  ])

  const exportToCSV = () => {
    if (filtered.length === 0) return

    const headers = [
      'ID',
      'Title',
      'Category',
      'Severity',
      'Status',
      'Location',
      'Description',
      'Created At',
      'Accepted At',
      'Resolved At',
      'Created By',
      'Created By Email',
      'Assigned Responder',
      'Latitude',
      'Longitude',
    ]

    const rows = filtered.map((emergency) => [
      emergency.id ?? '',
      emergency.title ?? '',
      emergency.category ?? '',
      emergency.severity ?? '',
      emergency.status ?? '',
      emergency.location ?? '',
      emergency.description ?? '',
      emergency.createdAt ?? '',
      emergency.acceptedAt ?? '',
      emergency.resolvedAt ?? '',
      emergency.createdBy?.name ?? '',
      emergency.createdBy?.email ?? '',
      emergency.assignedVolunteer?.name ?? '',
      emergency.latitude ?? '',
      emergency.longitude ?? '',
    ])

    const escapeCSVValue = (value) => {
      const text = String(value ?? '').replace(/"/g, '""')
      return `"${text}"`
    }

    const csvContent = [
      headers.map(escapeCSVValue).join(','),
      ...rows.map((row) =>
        row.map(escapeCSVValue).join(',')
      ),
    ].join('\n')

    const blob = new Blob(
      [`\uFEFF${csvContent}`],
      {
        type: 'text/csv;charset=utf-8;',
      }
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `cern-emergency-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout title="All Emergencies">
      {/* Search and export */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title, category, location, description, or responder..."
          className="input-field flex-1"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <button
          type="button"
          onClick={exportToCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>📥</span>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() =>
                setStatusFilter(filter.key)
              }
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === filter.key
                  ? 'bg-brand-red border-brand-red text-white'
                  : 'bg-card border-line text-ink2 hover:border-line2'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {SEVERITY_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() =>
                setSeverityFilter(filter.key)
              }
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                severityFilter === filter.key
                  ? 'bg-bg4 border-line2 text-ink'
                  : 'bg-card border-line text-ink2 hover:border-line2'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink3">
          {filtered.length} result
          {filtered.length !== 1 ? 's' : ''}
        </p>

        {(statusFilter !== 'ALL' ||
          severityFilter !== 'ALL' ||
          search.trim()) && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter('ALL')
              setSeverityFilter('ALL')
              setSearch('')
            }}
            className="text-xs font-medium text-brand-red2 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5">
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
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="text-3xl block mb-3">
            🔍
          </span>

          <p className="text-sm text-ink2">
            No emergencies match your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((emergency) => (
            <EmergencyCard
              key={emergency.id}
              emergency={emergency}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}