import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

export type CourseFiltersState = {
  category: string
  level: string
  priceType: string
  priceMin: string
  priceMax: string
  hoursMin: string
  hoursMax: string
}

type FiltersProps = {
  filters: CourseFiltersState
  onChange: (next: CourseFiltersState) => void
}

const selectClasses = 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus-ring'

export function Filters({ filters, onChange }: FiltersProps) {
  return (
    <div className='grid gap-4 rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-soft md:grid-cols-2 lg:grid-cols-4'>
      <label className='space-y-2 text-sm font-semibold text-neutral-700'>
        الفئة
        <Input
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
          placeholder='التغذية السريرية'
          className={cn('text-sm')}
        />
      </label>
      <label className='space-y-2 text-sm font-semibold text-neutral-700'>
        المستوى
        <select
          value={filters.level}
          onChange={(event) => onChange({ ...filters, level: event.target.value })}
          className={selectClasses}
        >
          <option value=''>الكل</option>
          <option value='BEGINNER'>مبتدئ</option>
          <option value='INTERMEDIATE'>متوسط</option>
          <option value='ADVANCED'>متقدم</option>
        </select>
      </label>
      <label className='space-y-2 text-sm font-semibold text-neutral-700'>
        نوع السعر
        <select
          value={filters.priceType}
          onChange={(event) => onChange({ ...filters, priceType: event.target.value })}
          className={selectClasses}
        >
          <option value='all'>الكل</option>
          <option value='free'>مجاني</option>
          <option value='paid'>مدفوع</option>
        </select>
      </label>
      <label className='space-y-2 text-sm font-semibold text-neutral-700'>
        السعر الأدنى
        <Input
          type='number'
          min={0}
          value={filters.priceMin}
          onChange={(event) => onChange({ ...filters, priceMin: event.target.value })}
          placeholder='0'
          className={cn('text-sm')}
        />
      </label>
      <label className='space-y-2 text-sm font-semibold text-neutral-700'>
        السعر الأعلى
        <Input
          type='number'
          min={0}
          value={filters.priceMax}
          onChange={(event) => onChange({ ...filters, priceMax: event.target.value })}
          placeholder='50'
          className={cn('text-sm')}
        />
      </label>
      <label className='space-y-2 text-sm font-semibold text-neutral-700'>
        الحد الأدنى للساعات
        <Input
          type='number'
          min={0}
          value={filters.hoursMin}
          onChange={(event) => onChange({ ...filters, hoursMin: event.target.value })}
          placeholder='4'
          className={cn('text-sm')}
        />
      </label>
      <label className='space-y-2 text-sm font-semibold text-neutral-700'>
        الحد الأعلى للساعات
        <Input
          type='number'
          min={0}
          value={filters.hoursMax}
          onChange={(event) => onChange({ ...filters, hoursMax: event.target.value })}
          placeholder='12'
          className={cn('text-sm')}
        />
      </label>
    </div>
  )
}
