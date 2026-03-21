import { useState } from 'react'
import { useCampaigns } from '../../hooks/useCampaigns'
import { CategoryBadge, SeverityBadge, StatusBadge } from '../shared/Badge'
import { timeAgo, formatCr } from '../../lib/utils'
import CampaignDetail from './CampaignDetail'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'

export default function CampaignTable() {
  const [expanded, setExpanded]   = useState(null)
  const [sevFilter, setSevFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { campaigns, loading, refetch } = useCampaigns({
    severity: sevFilter || undefined,
    status:   statusFilter || undefined,
  })

  return (
    <div className="card overflow-hidden">
      {/* Filters */}
      <div className="p-3 border-b border-white/5 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-auto">
          {campaigns.length} Campaigns
        </span>
        <select
          value={sevFilter}
          onChange={e => setSevFilter(e.target.value)}
          className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-400 focus:outline-none"
        >
          <option value="">All severities</option>
          {['critical','high','medium','low'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-400 focus:outline-none"
        >
          <option value="">All statuses</option>
          {['active','monitoring','neutralised'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={refetch} className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs text-slate-600 uppercase tracking-wider border-b border-white/5">
        <div className="col-span-3">Campaign</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">Severity</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">States</div>
        <div className="col-span-1">Threats</div>
        <div className="col-span-1">Detected</div>
        <div className="col-span-1" />
      </div>

      {loading && (
        <div className="p-8 text-center text-slate-600 text-sm">Loading campaigns…</div>
      )}

      {!loading && campaigns.length === 0 && (
        <div className="p-8 text-center text-slate-600 text-sm">No campaigns found</div>
      )}

      {campaigns.map(c => (
        <div key={c.id}>
          <div
            className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/3 hover:bg-white/2 transition-colors cursor-pointer items-center"
            onClick={() => setExpanded(expanded === c.id ? null : c.id)}
          >
            <div className="col-span-3">
              <div className="text-sm font-medium text-white truncate">{c.name}</div>
              {c.alert_fired && (
                <span className="text-xs text-red-400">Alert fired</span>
              )}
            </div>
            <div className="col-span-2">
              <CategoryBadge category={c.category} />
            </div>
            <div className="col-span-1">
              <SeverityBadge severity={c.severity} />
            </div>
            <div className="col-span-1">
              <StatusBadge status={c.status} />
            </div>
            <div className="col-span-2 text-xs text-slate-400 truncate">
              {(c.target_states || []).slice(0, 2).join(', ')}
              {(c.target_states || []).length > 2 && ` +${c.target_states.length - 2}`}
            </div>
            <div className="col-span-1 text-sm text-white tabular-nums">{c.threat_count}</div>
            <div className="col-span-1 text-xs text-slate-500">{timeAgo(c.first_detected || c.created)}</div>
            <div className="col-span-1 flex justify-end">
              {expanded === c.id
                ? <ChevronUp size={14} className="text-slate-500" />
                : <ChevronDown size={14} className="text-slate-500" />
              }
            </div>
          </div>

          {expanded === c.id && <CampaignDetail campaign={c} />}
        </div>
      ))}
    </div>
  )
}
