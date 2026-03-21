import { useThreats } from '../../hooks/useThreats'
import { CATEGORY_LABELS } from '../../lib/utils'

const FALLBACK = [
  { category: 'investment_scam',  raw_text: 'Fake Ambani investment group targeting Maharashtra' },
  { category: 'phishing',         raw_text: 'SBI account block phishing active in UP and Bihar' },
  { category: 'voice_clone',      raw_text: 'Voice clone emergency scam targeting elderly citizens' },
  { category: 'lottery_scam',     raw_text: 'KBC lottery fraud wave detected in West Bengal' },
  { category: 'fake_upi_refund',  raw_text: 'Fake NPCI refund OTP drain campaign via WhatsApp' },
  { category: 'mule_recruitment', raw_text: 'Bank account mule recruitment drive on Telegram' },
]

const CAT_COLORS = {
  investment_scam:    '#a78bfa',
  voice_clone:        '#f472b6',
  fake_upi_refund:    '#fbbf24',
  phishing:           '#f87171',
  mule_recruitment:   '#22d3ee',
  deepfake_celebrity: '#818cf8',
  lottery_scam:       '#a3e635',
  unknown:            '#94a3b8',
}

export default function ThreatTicker() {
  const { threats } = useThreats()
  const items = threats.length > 0 ? threats.slice(0, 12) : FALLBACK
  const repeated = [...items, ...items, ...items]

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(255,255,255,0.02)',
      padding: '8px 0',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: 'max-content',
        animation: 'surakshTicker 35s linear infinite',
        gap: '0px',
      }}>
        {repeated.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              paddingRight: '48px',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              flexShrink: 0,
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#ef4444',
              flexShrink: 0,
              display: 'inline-block',
            }} />
            <span style={{
              color: CAT_COLORS[t.category] || '#94a3b8',
              fontWeight: 600,
            }}>
              [{CATEGORY_LABELS[t.category] || t.category}]
            </span>
            <span style={{ color: '#94a3b8' }}>
              {(t.raw_text || '').slice(0, 60)}...
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes surakshTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  )
}