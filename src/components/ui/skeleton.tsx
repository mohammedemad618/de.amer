import * as React from 'react'
import { cn } from '@/lib/utils/cn'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-xl bg-neutral-200/70', className)} {...props} />
}


