import { useState, useEffect, useCallback, useRef } from 'react'
import { getThreats } from '../lib/api'

export function useThreats({ category, state, minConfidence = 0 } = {}) {
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)
  const prevIds = useRef(new Set())

  const fetch = useCallback(async () => {
    try {
      const data = await getThreats({
        per_page: 100,
        category: category || undefined,
        state: state || undefined,
        min_confidence: minConfidence,
      })
      const items = data.items || []

      const newItems = items.filter((t) => !prevIds.current.has(t.id))
      if (newItems.length > 0) {
        newItems.forEach((t) => prevIds.current.add(t.id))
        setThreats((prev) => [...newItems, ...prev].slice(0, 200))
      }
    } catch (e) {
      console.error('Threats fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [category, state, minConfidence])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, 3000)
    return () => clearInterval(id)
  }, [fetch])

  return { threats, loading }
}
