import { useEffect, useState } from 'react'
import { getCampaignThreats, getCampaignNetwork } from '../../lib/api'
import { CategoryBadge } from '../shared/Badge'
import { truncate, timeAgo } from '../../lib/utils'
import { motion } from 'framer-motion'

export default function CampaignDetail({ campaign }) {
  const [threats, setThreats]   = useState([])
  const [network, setNetwork]   = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      getCampaignThreats(campaign.id).catch(() => ({ items: [] })),
      getCampaignNetwork(campaign.id).catch(() => null),
    ]).then(([t, n]) => {
      setThreats(t.items || [])
      setNetwork(n)
    }).finally(() => setLoading(false))
  }, [campaign.id])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/2 border-b border-white/5 p-4"
    >
      {/* Summary */}
      {campaign.summary && (
        <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-3xl">
          {campaign.summary}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Threats */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            Threat Messages ({threats.length})
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {loading && <div className="text-xs text-slate-600">Loading…</div>}
            {threats.slice(0, 8).map((t, i) => (
              <div key={i} className="bg-white/3 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryBadge category={t.category} />
                  <span className="text-xs text-slate-600">{timeAgo(t.created)}</span>
                </div>
                <p className="text-xs text-slate-400">{truncate(t.raw_text, 100)}</p>
              </div>
            ))}
            {threats.length === 0 && !loading && (
              <div className="text-xs text-slate-600">No threats linked yet</div>
            )}
          </div>
        </div>

        {/* Network + States */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Target States</p>
            <div className="flex flex-wrap gap-1.5">
              {(campaign.target_states || []).map(s => (
                <span key={s} className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">{s}</span>
              ))}
            </div>
          </div>

          {network && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                Network ({network.nodes?.length || 0} entities)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(network.nodes || []).slice(0, 12).map((n, i) => (
                  <span key={i} className="badge bg-white/5 text-slate-400 border border-white/10 font-mono text-xs">
                    {n.type}: {n.value?.slice(0, 15)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
