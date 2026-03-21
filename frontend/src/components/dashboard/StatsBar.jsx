import { ShieldAlert, Activity, Bell, TrendingUp } from 'lucide-react'
import StatCard from '../shared/StatCard'
import { useStats } from '../../hooks/useStats'
import { formatCr } from '../../lib/utils'

export default function StatsBar() {
  const { stats, loading } = useStats()

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-4 animate-pulse h-20 bg-white/3" />
      ))}
    </div>
  )

  return (
    <div className="ml-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <StatCard
        label="Threats Detected"
        value={stats?.total_threats?.toLocaleString() ?? '—'}
        icon={ShieldAlert}
        color="text-red-400"
      />
      <StatCard
        label="Active Campaigns"
        value={stats?.active_campaigns?.toLocaleString() ?? '—'}
        icon={Activity}
        color="text-orange-400"
      />
      <StatCard
        label="Banks Alerted"
        value={stats?.total_alerts?.toLocaleString() ?? '—'}
        icon={Bell}
        color="text-blue-400"
      />
      <StatCard
        label="Est. Protected"
        value={formatCr(stats?.estimated_amount_protected_cr)}
        icon={TrendingUp}
        color="text-green-400"
        sub="conservative estimate"
      />
    </div>
  )
}
