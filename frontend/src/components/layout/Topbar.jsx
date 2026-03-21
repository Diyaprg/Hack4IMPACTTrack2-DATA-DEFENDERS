import { Zap } from 'lucide-react'
import ThreatLevelBanner from '../shared/ThreatLevelBanner'
import { useStats } from '../../hooks/useStats'
import { triggerTest } from '../../lib/api'
import { useState } from 'react'

export default function Topbar({ title }) {
  const { stats } = useStats()
  const [firing, setFiring] = useState(false)

  const handleTrigger = async () => {
    setFiring(true)
    try { await triggerTest() } catch {}
    setTimeout(() => setFiring(false), 2000)
  }

  return (
    <header className="h-14 border-b border-white/5 bg-navy-800/80 backdrop-blur flex items-center justify-between px-4 gap-4">
      <h1 className="text-sm font-semibold text-white truncate">{title}</h1>
      <div className="flex items-center gap-3 flex-shrink-0">
        <ThreatLevelBanner level={stats?.threat_level || 'normal'} />
        <button
          onClick={handleTrigger}
          disabled={firing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium transition-all disabled:opacity-50"
        >
          <Zap size={12} />
          {firing ? 'Firing…' : 'Test Alert'}
        </button>
      </div>
    </header>
  )
}
