import api from './api'

/**
 * Auth API service
 * Backend endpoints:
 *   POST /api/v1/auth/register
 *   POST /api/v1/auth/login
 */

export const register = async ({ name, email, phone, password, role }) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    phone,
    password,
    role, // CITIZEN | VOLUNTEER | ADMIN
  })
  return response.data
}

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

const authService = { register, login }
export default authService
