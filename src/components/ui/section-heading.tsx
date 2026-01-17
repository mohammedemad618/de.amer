import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type SectionHeadingProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  subtitle?: string
}

export function SectionHeading({ title, subtitle, className, ...props }: SectionHeadingProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <h2 className='text-2xl font-bold text-neutral-900 md:text-3xl'>{title}</h2>
      {subtitle ? <p className='text-base text-neutral-600 md:text-lg'>{subtitle}</p> : null}
    </div>
  )
}


