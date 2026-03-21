import { useState, useEffect, useCallback } from 'react'
import { getStats } from '../lib/api'

export function useStats(interval = 5000) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (e) {
      console.error('Stats fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, interval)
    return () => clearInterval(id)
  }, [fetch, interval])

  return { stats, loading, refetch: fetch }
}
