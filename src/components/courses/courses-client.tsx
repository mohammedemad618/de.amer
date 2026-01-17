'use client'

import * as React from 'react'
import Link from 'next/link'
import { CourseCard, CourseSummary } from './course-card'
import { Filters, CourseFiltersState } from './filters'
import { Button } from '@/components/ui/button'
import { MedicalIllustration } from '@/components/illustrations/medical-illustration'
import { Stagger, StaggerItem } from '@/components/ui/stagger'
import type { CurrencyCode } from '@/lib/settings'

const initialFilters: CourseFiltersState = {
  category: '',
  level: '',
  priceType: 'all',
  priceMin: '',
  priceMax: '',
  hoursMin: '',
  hoursMax: ''
}

export function CoursesClient({ courses, currency = 'USD' }: { courses: CourseSummary[]; currency?: CurrencyCode }) {
  const [filters, setFilters] = React.useState<CourseFiltersState>(initialFilters)

  const filteredCourses = React.useMemo(() => {
    const priceMin = filters.priceMin ? Number(filters.priceMin) : null
    const priceMax = filters.priceMax ? Number(filters.priceMax) : null
    const hoursMin = filters.hoursMin ? Number(filters.hoursMin) : null
    const hoursMax = filters.hoursMax ? Number(filters.hoursMax) : null

    return courses.filter((course) => {
      const categoryMatch = filters.category ? course.category.includes(filters.category) : true
      const levelMatch = filters.level ? course.level === filters.level : true
      const priceTypeMatch =
        filters.priceType === 'free'
          ? course.price === 0
          : filters.priceType === 'paid'
            ? course.price > 0
            : true
      const priceMinMatch = priceMin !== null ? course.price >= priceMin : true
      const priceMaxMatch = priceMax !== null ? course.price <= priceMax : true
      const hoursMinMatch = hoursMin !== null ? course.hours >= hoursMin : true
      const hoursMaxMatch = hoursMax !== null ? course.hours <= hoursMax : true

      return (
        categoryMatch &&
        levelMatch &&
        priceTypeMatch &&
        priceMinMatch &&
        priceMaxMatch &&
        hoursMinMatch &&
        hoursMaxMatch
      )
    })
  }, [courses, filters])

  return (
    <div className='space-y-8'>
      <Filters filters={filters} onChange={setFilters} />
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-sm text-neutral-600'>عدد الدورات: {filteredCourses.length}</p>
        <Button variant='ghost' size='sm' onClick={() => setFilters(initialFilters)}>
          إعادة تعيين الفلاتر
        </Button>
      </div>
      {filteredCourses.length === 0 ? (
        <div className='grid items-center gap-6 rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-8 md:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-3'>
            <p className='text-base font-semibold text-neutral-800'>لا توجد دورات مطابقة لهذه الفلاتر حالياً.</p>
            <p className='text-sm text-neutral-600'>جرّب تعديل الفلاتر أو تواصل معنا لمساعدتك في اختيار المسار المناسب.</p>
            <Button asChild variant='outline'>
              <Link href='/contact'>تواصل مع الفريق</Link>
            </Button>
          </div>
          <div className='relative h-56 w-full'>
            <MedicalIllustration id='consultationScene' />
          </div>
        </div>
      ) : (
        <Stagger className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredCourses.map((course) => (
            <StaggerItem key={course.id}>
              <CourseCard course={course} currency={currency} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  )
}
