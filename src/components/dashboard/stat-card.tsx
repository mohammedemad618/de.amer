import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

type StatCardProps = {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  accent?: 'primary' | 'success' | 'warning' | 'info'
  className?: string
}

const accentColors = {
  primary: 'text-primary',
  success: 'text-accent-green',
  warning: 'text-accent-orange',
  info: 'text-accent-turquoise'
}

export function StatCard({ label, value, icon, trend, accent = 'primary', className }: StatCardProps) {
  return (
    <Card variant='glass' className={cn('relative overflow-hidden transition-all hover:shadow-lg', className)}>
      <div className='space-y-3'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <p className='text-xs font-semibold text-neutral-500 uppercase tracking-wide'>{label}</p>
            <p className={cn('text-3xl font-bold', accentColors[accent])}>{value}</p>
          </div>
          {icon && <div className={cn('text-2xl opacity-20', accentColors[accent])}>{icon}</div>}
        </div>
        {trend && (
          <div className='flex items-center gap-1 text-xs'>
            <span className={trend.value >= 0 ? 'text-accent-green' : 'text-accent-orange'}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className='text-neutral-500'>{trend.label}</span>
          </div>
        )}
      </div>
      <div className={cn('absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-5', accentColors[accent])} />
    </Card>
  )
}
