import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant
  title?: string
}

const variantClasses: Record<AlertVariant, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-orange-200 bg-orange-50 text-orange-800',
  info: 'border-teal-200 bg-teal-50 text-teal-800'
}

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  return (
    <div className={cn('rounded-xl border px-4 py-3 text-sm', variantClasses[variant], className)} {...props}>
      {title ? <p className='mb-1 font-semibold'>{title}</p> : null}
      {children}
    </div>
  )
}


