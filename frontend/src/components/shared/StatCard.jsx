import { cn } from '../../lib/utils'

export default function StatCard({ label, value, sub, icon: Icon, color = 'text-blue-400', className }) {
  return (
    <div className={cn('card p-4 flex items-start gap-3', className)}>
      {Icon && (
        <div className={cn('p-2 rounded-lg bg-white/5 mt-0.5', color)}>
          <Icon size={16} />
        </div>
      )}
      <div className="min-w-0">
        <div className={cn('text-2xl font-bold tabular-nums', color)}>{value}</div>
        <div className="text-xs text-slate-500 mt-0.5 truncate">{label}</div>
        {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}
