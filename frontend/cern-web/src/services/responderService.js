import api from './api'

const responderService = {
  getAllResponders: async () => {
    const response = await api.get('/admin/responders')
    return response.data
  },

  createResponder: async (data) => {
    const response = await api.post('/admin/responders', data)
    return response.data
  },
}

export default responderService