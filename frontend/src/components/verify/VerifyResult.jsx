import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VerifyResult({ result }) {
  if (!result) return null

  const isFraud = result.is_fraud
  const pct     = Math.round((result.fraud_probability || 0) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 w-full max-w-xl mx-auto border ${
        isFraud ? 'border-red-500/30' : 'border-green-500/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
          isFraud ? 'bg-red-500/15 pulse-glow' : 'bg-green-500/15'
        }`}>
          {isFraud
            ? <ShieldAlert size={28} className="text-red-400" />
            : <ShieldCheck size={28} className="text-green-400" />
          }
        </div>
        <div>
          <div className={`text-3xl font-bold tabular-nums ${isFraud ? 'text-red-400' : 'text-green-400'}`}>
            {pct}%
          </div>
          <div className="text-sm text-slate-400">
            {isFraud ? 'Fraud Probability' : 'Looks Clean'}
          </div>
          <div className="text-xs text-slate-600 capitalize mt-0.5">
            Confidence: {result.confidence}
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-white/3 rounded-lg p-3 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed">{result.reason}</p>
      </div>

      {/* Network position */}
      {result.network_position && result.network_position.connected_campaigns?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Linked Campaigns</p>
          <div className="flex flex-wrap gap-1.5">
            {result.network_position.connected_campaigns.map((c, i) => (
              <span key={i} className="badge bg-red-500/10 text-red-400 border border-red-500/20 font-mono text-xs">
                {c.slice(0, 12)}…
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className={`flex items-start gap-2 rounded-lg p-3 ${
        isFraud ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'
      }`}>
        <AlertTriangle size={14} className={`mt-0.5 flex-shrink-0 ${isFraud ? 'text-red-400' : 'text-green-400'}`} />
        <p className={`text-sm font-medium ${isFraud ? 'text-red-300' : 'text-green-300'}`}>
          {result.recommendation}
        </p>
      </div>

      {isFraud && (
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={12} />
          Report at cybercrime.gov.in
        </a>
      )}

      <p className="text-xs text-slate-600 mt-3">
        Checked against {result.checked_against?.toLocaleString()} known threat entities
      </p>
    </motion.div>
  )
}
