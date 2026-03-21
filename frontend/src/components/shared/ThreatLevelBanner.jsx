import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn, THREAT_LEVEL_CONFIG } from '../../lib/utils'
import PulseDot from './PulseDot'

const ICONS = {
  critical: ShieldAlert,
  high:     AlertTriangle,
  elevated: Shield,
  normal:   ShieldCheck,
}

const DOT_COLORS = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  elevated: 'bg-yellow-500',
  normal:   'bg-green-500',
}

export default function ThreatLevelBanner({ level = 'normal' }) {
  const cfg  = THREAT_LEVEL_CONFIG[level] || THREAT_LEVEL_CONFIG.normal
  const Icon = ICONS[level] || ShieldCheck

  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium', cfg.bg, cfg.border, cfg.color)}>
      <PulseDot color={DOT_COLORS[level]} size="w-1.5 h-1.5" />
      <Icon size={13} />
      <span>THREAT LEVEL: {cfg.label}</span>
    </div>
  )
}
