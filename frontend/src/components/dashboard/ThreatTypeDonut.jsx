import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useThreats } from '../../hooks/useThreats'
import { useMemo } from 'react'
import { CATEGORY_LABELS } from '../../lib/utils'

const COLORS = ['#8B5CF6','#EF4444','#EC4899','#F59E0B','#06B6D4','#84CC16','#6366F1','#6B7280']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-800 border border-white/10 rounded-lg p-2 text-xs">
      <p style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
      <p className="text-slate-300">{payload[0].value} threats ({payload[0].payload.pct}%)</p>
    </div>
  )
}

export default function ThreatTypeDonut() {
  const { threats } = useThreats()

  const data = useMemo(() => {
    const counts = {}
    threats.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1 })
    const total = Math.max(Object.values(counts).reduce((a, b) => a + b, 0), 1)
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count], i) => ({
        name: CATEGORY_LABELS[cat] || cat,
        value: count,
        pct: Math.round((count / total) * 100),
        fill: COLORS[i % COLORS.length],
      }))
  }, [threats])

  return (
    <div className="card p-3 h-full flex flex-col">
      <div className="p-3 border-b border-white/5 flex items-center justify-between gap-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Threat Types
      </span>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div className="w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.length ? data : [{ name: 'None', value: 1, fill: '#1e3a5f' }]}
                cx="50%" cy="50%"
                innerRadius={28} outerRadius={52}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          {data.slice(0, 5).map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
              <span className="text-slate-400 truncate flex-1">{d.name}</span>
              <span className="text-slate-500 font-mono">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
