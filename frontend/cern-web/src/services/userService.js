import api from './api'

export const updateProfile = async (payload) => {
  const response = await api.put('/users/profile', payload)
  return response.data
}