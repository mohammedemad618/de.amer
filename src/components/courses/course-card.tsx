'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { formatPrice, type CurrencyCode } from '@/lib/settings'

export type CourseSummary = {
  id: string
  title: string
  category: string
  description: string
  hours: number
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  thumbnail: string
}

const levelLabels: Record<CourseSummary['level'], string> = {
  BEGINNER: 'مبتدئ',
  INTERMEDIATE: 'متوسط',
  ADVANCED: 'متقدم'
}

type CourseCardProps = {
  course: CourseSummary
  currency?: CurrencyCode
}

export function CourseCard({ course, currency = 'USD' }: CourseCardProps) {
  const priceLabel = formatPrice(course.price, currency)

  return (
    <Card variant='elevated' className='flex h-full flex-col gap-4 transition hover:-translate-y-1'>
      <div className='relative h-40 w-full overflow-hidden rounded-xl bg-neutral-100'>
        <Image src={course.thumbnail} alt={course.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 33vw' />
      </div>
      <div className='flex flex-wrap gap-2'>
        <Badge variant='info'>{course.category}</Badge>
        <Badge variant='neutral'>{levelLabels[course.level]}</Badge>
        <Badge variant='success'>{priceLabel}</Badge>
      </div>
      <div className='flex-1 space-y-2'>
        <h3 className='text-lg font-bold text-neutral-900'>{course.title}</h3>
        <p className='text-sm text-neutral-600'>{course.description}</p>
      </div>
      <div className='flex items-center justify-between text-sm text-neutral-600'>
        <span>{course.hours} ساعة تدريبية</span>
        <Link
          href={`/courses/${course.id}`}
          className={cn(
            'inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-ring'
          )}
        >
          تفاصيل الدورة
        </Link>
      </div>
    </Card>
  )
}
