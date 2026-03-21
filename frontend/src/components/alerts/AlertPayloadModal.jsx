import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { SeverityBadge } from '../shared/Badge'
import { formatDate } from '../../lib/utils'

export default function AlertPayloadModal({ alert, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(alert.payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-navy-800 border border-white/10 rounded-xl p-5 w-full max-w-2xl max-h-[80vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">{alert.campaign_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <SeverityBadge severity={alert.risk_level} />
                <span className="text-xs text-slate-500">{formatDate(alert.created)}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
              <X size={18} />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/3 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-400">{(alert.banks_notified || []).length}</div>
              <div className="text-xs text-slate-500">Banks Notified</div>
            </div>
            <div className="bg-white/3 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">
                ₹{(alert.estimated_amount_protected_cr || 0).toFixed(1)} Cr
              </div>
              <div className="text-xs text-slate-500">Est. Protected</div>
            </div>
            <div className="bg-white/3 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-400">
                {alert.certin_notified ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-slate-500">CERT-In Notified</div>
            </div>
          </div>

          {/* Payload */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Full Alert Payload (CERT-In format)</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="flex-1 overflow-y-auto bg-black/30 rounded-lg p-3 text-xs font-mono text-slate-300 leading-relaxed">
            {JSON.stringify(alert.payload || {}, null, 2)}
          </pre>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
