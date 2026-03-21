import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API Error:', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export const getStats        = ()               => api.get('/stats')
export const getThreats      = (params = {})    => api.get('/threats', { params })
export const getThreat       = (id)             => api.get(`/threats/${id}`)
export const getCampaigns    = (params = {})    => api.get('/campaigns', { params })
export const getCampaign     = (id)             => api.get(`/campaigns/${id}`)
export const getCampaignThreats  = (id)         => api.get(`/campaigns/${id}/threats`)
export const getCampaignNetwork  = (id)         => api.get(`/campaigns/${id}/network`)
export const getAlerts       = (params = {})    => api.get('/alerts', { params })
export const getAlert        = (id)             => api.get(`/alerts/${id}`)
export const getNetworkGraph = ()               => api.get('/network/graph')
export const getNetworkStats = ()               => api.get('/network/stats')
export const verify          = (data)           => api.post('/verify', data)
export const triggerTest     = ()               => api.post('/trigger/test')
export const ingestManual    = (text, source)   => api.post('/ingest/manual', { text, source })

export default api
