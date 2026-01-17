'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ImageUpload } from './image-upload'

const courseSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
  description: z.string().min(1, 'الوصف مطلوب'),
  objectives: z.string().min(1, 'الأهداف مطلوبة'),
  hours: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'عدد الساعات يجب أن يكون رقماً موجباً'
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'السعر يجب أن يكون رقماً موجباً أو صفر'
  }),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  thumbnail: z.string().min(1, 'صورة الدورة مطلوبة').or(z.literal('')),
  meetingLink: z.string().url('رابط الاجتماع يجب أن يكون رابطاً صالحاً').optional().or(z.literal(''))
})

type CourseFormData = z.infer<typeof courseSchema>

type CourseFormProps = {
  course?: {
    id: string
    title: string
    category: string
    description: string
    objectives: string
    hours: number
    price: number
    level: string
    thumbnail: string
    meetingLink?: string | null
  }
  onSubmit: (data: CourseFormData) => Promise<void>
  onCancel?: () => void
}

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [csrfToken, setCsrfToken] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title,
          category: course.category,
          description: course.description,
          objectives: course.objectives,
          hours: course.hours.toString(),
          price: course.price.toString(),
          level: course.level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
          thumbnail: course.thumbnail,
          meetingLink: course.meetingLink || ''
        }
      : undefined
  })

  const thumbnailValue = watch('thumbnail')

  React.useEffect(() => {
    async function loadToken() {
      try {
        const response = await fetch('/api/auth/csrf', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          setCsrfToken(data.csrfToken)
        }
      } catch (error) {
        console.error('خطأ في تحميل CSRF token:', error)
      }
    }
    loadToken()
  }, [])

  const onSubmitForm = async (data: CourseFormData) => {
    if (!csrfToken) {
      alert('جاري تحميل رمز الحماية... يرجى الانتظار.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card variant='elevated' className='w-full space-y-6 p-6'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold text-neutral-900'>{course ? 'تعديل الدورة' : 'إضافة دورة جديدة'}</h2>
        <p className='text-sm text-neutral-600'>املأ البيانات التالية لإضافة دورة جديدة.</p>
      </div>

      <form className='space-y-4' onSubmit={handleSubmit(onSubmitForm)}>
        <div className='grid gap-4 sm:grid-cols-2'>
          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            العنوان *
            <Input {...register('title')} state={errors.title ? 'error' : 'default'} placeholder='عنوان الدورة' />
            {errors.title && <span className='text-xs text-error'>{errors.title.message}</span>}
          </label>

          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            الفئة *
            <Input {...register('category')} state={errors.category ? 'error' : 'default'} placeholder='مثال: التغذية العلاجية' />
            {errors.category && <span className='text-xs text-error'>{errors.category.message}</span>}
          </label>
        </div>

        <label className='space-y-2 text-sm font-semibold text-neutral-700'>
          الوصف *
          <textarea
            {...register('description')}
            className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
            rows={3}
            placeholder='وصف مختصر للدورة'
          />
          {errors.description && <span className='text-xs text-error'>{errors.description.message}</span>}
        </label>

        <label className='space-y-2 text-sm font-semibold text-neutral-700'>
          الأهداف *
          <textarea
            {...register('objectives')}
            className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
            rows={3}
            placeholder='أهداف الدورة (سطر واحد لكل هدف)'
          />
          {errors.objectives && <span className='text-xs text-error'>{errors.objectives.message}</span>}
        </label>

        <div className='grid gap-4 sm:grid-cols-3'>
          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            عدد الساعات *
            <Input
              type='number'
              {...register('hours')}
              state={errors.hours ? 'error' : 'default'}
              placeholder='10'
              min={1}
            />
            {errors.hours && <span className='text-xs text-error'>{errors.hours.message}</span>}
          </label>

          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            السعر *
            <Input
              type='number'
              step='0.01'
              {...register('price')}
              state={errors.price ? 'error' : 'default'}
              placeholder='0.00'
              min={0}
            />
            {errors.price && <span className='text-xs text-error'>{errors.price.message}</span>}
          </label>

          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            المستوى *
            <select
              {...register('level')}
              className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
            >
              <option value='BEGINNER'>مبتدئ</option>
              <option value='INTERMEDIATE'>متوسط</option>
              <option value='ADVANCED'>متقدم</option>
            </select>
            {errors.level && <span className='text-xs text-error'>{errors.level.message}</span>}
          </label>
        </div>

        <ImageUpload
          value={thumbnailValue || course?.thumbnail}
          onChange={(path) => setValue('thumbnail', path)}
          type='course'
          label='صورة الدورة *'
        />
        <input type='hidden' {...register('thumbnail')} />
        {errors.thumbnail && <span className='text-xs text-error'>{errors.thumbnail.message}</span>}

        <label className='space-y-2 text-sm font-semibold text-neutral-700'>
          رابط الاجتماع (Teams/Meet)
          <Input
            {...register('meetingLink')}
            state={errors.meetingLink ? 'error' : 'default'}
            placeholder='https://teams.microsoft.com/... أو https://meet.google.com/...'
            type='url'
          />
          {errors.meetingLink && <span className='text-xs text-error'>{errors.meetingLink.message}</span>}
          <p className='text-xs text-neutral-500'>يمكن إضافة رابط الاجتماع لاحقاً</p>
        </label>

        <div className='flex gap-4'>
          <Button type='submit' disabled={isSubmitting || !csrfToken} className='flex-1'>
            {isSubmitting ? 'جاري الحفظ...' : course ? 'تحديث الدورة' : 'إضافة الدورة'}
          </Button>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
              إلغاء
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
