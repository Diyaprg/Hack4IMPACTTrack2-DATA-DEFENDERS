import { useState, useEffect, useCallback } from 'react'
import { getCampaigns } from '../lib/api'

export function useCampaigns({ status, severity } = {}) {
  const [campaigns, setCampaigns] = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)

  const fetch = useCallback(async () => {
    try {
      const data = await getCampaigns({
        per_page: 50,
        status: status || undefined,
        severity: severity || undefined,
      })
      setCampaigns(data.items || [])
      setTotal(data.total || 0)
    } catch (e) {
      console.error('Campaigns fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [status, severity])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, 10000)
    return () => clearInterval(id)
  }, [fetch])

  return { campaigns, total, loading, refetch: fetch }
}
