import { cn } from '@/lib/utils/cn'

type ProgressBarProps = {
  value: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'info'
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3'
}

const variantClasses = {
  primary: 'bg-primary',
  success: 'bg-accent-green',
  warning: 'bg-accent-orange',
  info: 'bg-accent-turquoise'
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = 'md',
  variant = 'primary'
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full space-y-1', className)}>
      {showLabel && (
        <div className='flex items-center justify-between text-xs'>
          <span className='font-semibold text-neutral-700'>التقدم</span>
          <span className='text-neutral-500'>{clampedValue}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-neutral-200', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}


