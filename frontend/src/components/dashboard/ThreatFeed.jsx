import { useThreats } from '../../hooks/useThreats'
import { CategoryBadge } from '../shared/Badge'
import { timeAgo, truncate, confidenceColor } from '../../lib/utils'
import { useState } from 'react'

const CATEGORIES = ['', 'investment_scam', 'voice_clone', 'fake_upi_refund', 'phishing', 'mule_recruitment', 'lottery_scam']

export default function ThreatFeed() {
  const [filter, setFilter] = useState('')
  const { threats, loading } = useThreats({ category: filter || undefined })

  return (
    <div className="card flex flex-col h-full">
      <div className="p-3 border-b border-white/5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider p-2">Live Threat Feed</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-400 focus:outline-none"
        >
          <option value="">All types</option>
          {CATEGORIES.slice(1).map(c => (
            <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray/3">
        {loading && (
          <div className="p-4 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-white/3 rounded animate-pulse" />
            ))}
          </div>
        )}

        {!loading && threats.length === 0 && (
          <div className="p-8 text-center text-slate-600 text-sm">No threats detected yet</div>
        )}

        {threats.map((t, i) => (
          <div key={t.id || i} className="threat-feed-item p-3 hover:bg-white/2 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1">
              <CategoryBadge category={t.category} />
              <span className={`text-xs font-mono font-medium ${confidenceColor(t.confidence)}`}>
                {Math.round((t.confidence || 0) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-1">
              {truncate(t.raw_text, 90)}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{t.channel_name || t.source}</span>
              <span className="text-xs text-slate-600">{timeAgo(t.ingested_at || t.created)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
