import { cn, CATEGORY_COLORS, CATEGORY_LABELS, SEVERITY_COLORS } from '../../lib/utils'

export function CategoryBadge({ category, className }) {
  return (
    <span className={cn('badge border', CATEGORY_COLORS[category] || CATEGORY_COLORS.unknown, className)}>
      {CATEGORY_LABELS[category] || category}
    </span>
  )
}

export function SeverityBadge({ severity, className }) {
  return (
    <span className={cn('badge border capitalize', SEVERITY_COLORS[severity] || SEVERITY_COLORS.low, className)}>
      {severity}
    </span>
  )
}

export function StatusBadge({ status, className }) {
  const map = {
    active:      'bg-green-500/15 text-green-400 border-green-500/20',
    monitoring:  'bg-blue-500/15 text-blue-400 border-blue-500/20',
    neutralised: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    delivered:   'bg-green-500/15 text-green-400 border-green-500/20',
    partial:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    failed:      'bg-red-500/15 text-red-400 border-red-500/20',
  }
  return (
    <span className={cn('badge border capitalize', map[status] || map.monitoring, className)}>
      {status}
    </span>
  )
}
