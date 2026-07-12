import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const getReportRows = (emergencies = []) =>
  emergencies.map((emergency) => [
    emergency.id ?? '',
    emergency.title ?? '',
    emergency.category ?? '',
    emergency.severity ?? '',
    emergency.status ?? '',
    emergency.location ?? '',
    emergency.createdAt
      ? new Date(emergency.createdAt).toLocaleString()
      : '',
    emergency.acceptedAt
      ? new Date(emergency.acceptedAt).toLocaleString()
      : '',
    emergency.resolvedAt
      ? new Date(emergency.resolvedAt).toLocaleString()
      : '',
    emergency.createdBy?.name ?? '',
    emergency.assignedVolunteer?.name ?? '',
  ])

const HEADERS = [
  'ID',
  'Title',
  'Category',
  'Severity',
  'Status',
  'Location',
  'Created At',
  'Accepted At',
  'Resolved At',
  'Reported By',
  'Assigned Responder',
]

const cleanFilename = (name = 'emergency-report') =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export const exportEmergenciesToCSV = (
  emergencies,
  reportName = 'Emergency Report'
) => {
  if (!emergencies?.length) return

  const escapeCSV = (value) => {
    const text = String(value ?? '').replace(/"/g, '""')
    return `"${text}"`
  }

  const rows = getReportRows(emergencies)

  const csv = [
    HEADERS.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n')

  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${cleanFilename(reportName)}-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export const exportEmergenciesToPDF = (
  emergencies,
  reportName = 'Emergency Report'
) => {
  if (!emergencies?.length) return

  const document = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  document.setFontSize(18)
  document.text(reportName, 14, 16)

  document.setFontSize(10)
  document.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    23
  )

  document.text(
    `Total records: ${emergencies.length}`,
    14,
    29
  )

  autoTable(document, {
    startY: 35,
    head: [HEADERS],
    body: getReportRows(emergencies),
    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: 'linebreak',
    },
    headStyles: {
      fontSize: 7,
    },
    columnStyles: {
      1: { cellWidth: 30 },
      5: { cellWidth: 35 },
    },
  })

  document.save(
    `${cleanFilename(reportName)}-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  )
}