import { useState, useEffect, useCallback } from 'react'
import { getAlerts } from '../lib/api'

export function useAlerts() {
  const [alerts, setAlerts]   = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const data = await getAlerts({ per_page: 50 })
      setAlerts(data.items || [])
      setTotal(data.total || 0)
    } catch (e) {
      console.error('Alerts fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, 8000)
    return () => clearInterval(id)
  }, [fetch])

  return { alerts, total, loading, refetch: fetch }
}
