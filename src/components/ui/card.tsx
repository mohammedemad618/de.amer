import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white',
  elevated: 'bg-white shadow-soft',
  bordered: 'bg-white border border-neutral-200',
  glass: 'bg-white/70 backdrop-blur border border-white/60 shadow-glass'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-2xl p-6 transition', variantClasses[variant], className)}
      {...props}
    />
  )
}


