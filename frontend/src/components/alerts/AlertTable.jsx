import { useState } from 'react'
import { useAlerts } from '../../hooks/useAlerts'
import { SeverityBadge, StatusBadge } from '../shared/Badge'
import { timeAgo, formatCr } from '../../lib/utils'
import AlertPayloadModal from './AlertPayloadModal'
import { Eye } from 'lucide-react'

const BANK_COLORS = {
  SBI:     'bg-blue-500/10 text-blue-400',
  HDFC:    'bg-red-500/10 text-red-400',
  Paytm:   'bg-indigo-500/10 text-indigo-400',
  PhonePe: 'bg-purple-500/10 text-purple-400',
}

export default function AlertTable() {
  const { alerts, total, loading } = useAlerts()
  const [selected, setSelected]   = useState(null)

  return (
    <>
      <div className="card overflow-hidden">
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {total} Total Alerts Filed
          </span>
          <span className="text-xs text-slate-600">Click any row to see full payload</span>
        </div>

        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs text-slate-600 uppercase tracking-wider border-b border-white/5">
          <div className="col-span-3">Campaign</div>
          <div className="col-span-1">Risk</div>
          <div className="col-span-4">Banks Notified</div>
          <div className="col-span-1">CERT-In</div>
          <div className="col-span-1">Protected</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1" />
        </div>

        {loading && (
          <div className="p-8 text-center text-slate-600 text-sm">Loading alerts…</div>
        )}

        {!loading && alerts.length === 0 && (
          <div className="p-8 text-center text-slate-600 text-sm">No alerts fired yet</div>
        )}

        {alerts.map(a => (
          <div
            key={a.id}
            className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/3 hover:bg-white/2 transition-colors cursor-pointer items-center"
            onClick={() => setSelected(a)}
          >
            <div className="col-span-3">
              <div className="text-sm font-medium text-white truncate">{a.campaign_name}</div>
              <div className="text-xs text-slate-600">{timeAgo(a.created)}</div>
            </div>
            <div className="col-span-1">
              <SeverityBadge severity={a.risk_level} />
            </div>
            <div className="col-span-4 flex flex-wrap gap-1">
              {(a.banks_notified || []).map(b => (
                <span key={b} className={`badge text-xs ${BANK_COLORS[b] || 'bg-white/5 text-slate-400'}`}>
                  {b}
                </span>
              ))}
            </div>
            <div className="col-span-1 text-xs">
              {a.certin_notified
                ? <span className="text-green-400">Yes</span>
                : <span className="text-slate-600">No</span>
              }
            </div>
            <div className="col-span-1 text-sm font-medium text-green-400">
              {formatCr(a.estimated_amount_protected_cr)}
            </div>
            <div className="col-span-1">
              <StatusBadge status={a.status} />
            </div>
            <div className="col-span-1 flex justify-end">
              <Eye size={13} className="text-slate-600" />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <AlertPayloadModal alert={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
