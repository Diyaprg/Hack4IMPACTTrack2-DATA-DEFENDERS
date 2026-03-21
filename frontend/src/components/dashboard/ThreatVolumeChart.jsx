import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useThreats } from '../../hooks/useThreats'
import { useMemo } from 'react'
import { format } from 'date-fns'

const LINES = [
  { key: 'investment_scam',  color: '#8B5CF6' },
  { key: 'phishing',         color: '#EF4444' },
  { key: 'voice_clone',      color: '#EC4899' },
  { key: 'lottery_scam',     color: '#84CC16' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-800 border border-white/10 rounded-lg p-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey.replace(/_/g, ' ')}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function ThreatVolumeChart() {
  const { threats } = useThreats()

  const data = useMemo(() => {
    const buckets = {}
    threats.forEach(t => {
      const d = t.ingested_at || t.created
      if (!d) return
      const key = format(new Date(d), 'HH:mm')
      if (!buckets[key]) buckets[key] = { time: key }
      buckets[key][t.category] = (buckets[key][t.category] || 0) + 1
    })
    return Object.values(buckets).slice(-20)
  }, [threats])

  return (
    <div className="card p-3 h-full flex flex-col ">
      <div className="p-3 border-b border-white/5 flex items-center justify-between gap-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Threat Volume (last 24h)
      </span>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {LINES.map(l => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                stroke={l.color}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
