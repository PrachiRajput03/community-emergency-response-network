import api from './api'

/**
 * Dashboard API service
 * Backend endpoint:
 *   GET /api/v1/dashboard/stats
 */

// ADMIN: get aggregate dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats')
  return response.data
}

const dashboardService = { getDashboardStats }
export default dashboardService
