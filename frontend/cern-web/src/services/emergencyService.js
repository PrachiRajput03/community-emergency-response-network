import api from './api'

/**
 * Emergency API service
 * Backend endpoints:
 *   POST   /api/v1/emergencies
 *   GET    /api/v1/emergencies
 *   GET    /api/v1/emergencies/{id}
 *   POST   /api/v1/emergencies/{id}/accept
 *   POST   /api/v1/emergencies/{id}/resolve
 *   GET    /api/v1/emergencies/my
 *   GET    /api/v1/emergencies/my-assigned
 *   GET    /api/v1/emergencies/status/{status}
 *   GET    /api/v1/emergencies/severity/{severity}
 */

// CITIZEN: create a new emergency
export const createEmergency = async ({
  title,
  type,
  severity,
  description,
  location,
  address,
  latitude,
  longitude,
}) => {
  const response = await api.post('/emergencies', {
    title: title || type || 'Emergency Report',
    description,
    location: location || address || 'Location not provided',
    severity,
    latitude,
    longitude,
  })

  return response.data
}

// ADMIN: get all emergencies
export const getAllEmergencies = async () => {
  const response = await api.get('/emergencies')
  return response.data
}

// Get single emergency by id
export const getEmergencyById = async (id) => {
  const response = await api.get(`/emergencies/${id}`)
  return response.data
}

// VOLUNTEER: accept an emergency
export const acceptEmergency = async (id) => {
  const response = await api.post(`/emergencies/${id}/accept`)
  return response.data
}

// VOLUNTEER: resolve an emergency
export const resolveEmergency = async (id) => {
  const response = await api.post(`/emergencies/${id}/resolve`)
  return response.data
}

// CITIZEN: get emergencies I reported
export const getMyEmergencies = async () => {
  const response = await api.get('/emergencies/my')
  return response.data
}

// VOLUNTEER: get emergencies assigned to me
export const getMyAssignedEmergencies = async () => {
  const response = await api.get('/emergencies/my-assigned')
  return response.data
}

// Filter by status: OPEN | IN_PROGRESS | RESOLVED
export const getEmergenciesByStatus = async (status) => {
  const response = await api.get(`/emergencies/status/${status}`)
  return response.data
}

// Filter by severity: LOW | MEDIUM | HIGH | CRITICAL
export const getEmergenciesBySeverity = async (severity) => {
  const response = await api.get(`/emergencies/severity/${severity}`)
  return response.data
}

const emergencyService = {
  createEmergency,
  getAllEmergencies,
  getEmergencyById,
  acceptEmergency,
  resolveEmergency,
  getMyEmergencies,
  getMyAssignedEmergencies,
  getEmergenciesByStatus,
  getEmergenciesBySeverity,
}

export default emergencyService
