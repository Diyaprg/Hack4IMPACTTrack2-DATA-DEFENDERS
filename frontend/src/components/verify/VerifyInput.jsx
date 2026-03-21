import { useState } from 'react'
import { Phone, CreditCard, Video, Search, Loader2 } from 'lucide-react'
import { verify } from '../../lib/api'

const TABS = [
  { id: 'phone', label: 'Phone Number', icon: Phone,       placeholder: '9876543210' },
  { id: 'upi',   label: 'UPI ID',       icon: CreditCard,  placeholder: 'someone@upi' },
  { id: 'video', label: 'Video URL',    icon: Video,        placeholder: 'https://...' },
]

export default function VerifyInput({ onResult }) {
  const [tab,     setTab]     = useState('phone')
  const [value,   setValue]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const currentTab = TABS.find(t => t.id === tab)

  const handleVerify = async () => {
    if (!value.trim()) { setError('Please enter a value'); return }
    setError('')
    setLoading(true)
    try {
      const result = await verify({ type: tab, value: value.trim() })
      onResult(result)
    } catch (e) {
      setError('Verification failed. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 w-full max-w-xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white/3 p-1 rounded-lg">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setValue(''); onResult(null); setError('') }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
              tab === t.id
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <t.icon size={13} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative mb-4">
        <currentTab.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          className="input pl-9 pr-4 py-3 text-sm"
          placeholder={currentTab.placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
        />
      </div>

      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Scanning {(50000).toLocaleString()}+ known fraud entities…
          </>
        ) : (
          <>
            <Search size={14} />
            Check Now
          </>
        )}
      </button>
    </div>
  )
}
