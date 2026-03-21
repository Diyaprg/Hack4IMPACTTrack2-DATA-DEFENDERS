import { cn } from '../../lib/utils'

export default function PulseDot({ color = 'bg-green-500', size = 'w-2 h-2', className }) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-40', color)} />
      <span className={cn('relative inline-flex rounded-full', size, color)} />
    </span>
  )
}
