'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const lessonSchema = z.object({
  title: z.string().min(1, 'عنوان الدرس مطلوب'),
  description: z.string().min(1, 'وصف الدرس مطلوب'),
  content: z.string().min(1, 'محتوى الدرس مطلوب'),
  order: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'ترتيب الدرس يجب أن يكون رقماً موجباً'
  }),
  duration: z.string().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
    message: 'مدة الدرس يجب أن تكون رقماً موجباً'
  }).optional().or(z.literal('')),
  videoUrl: z.string().url('رابط الفيديو يجب أن يكون رابطاً صالحاً').optional().or(z.literal(''))
})

type LessonFormData = z.infer<typeof lessonSchema>

type LessonFormProps = {
  courseId: string
  lesson?: {
    id: string
    title: string
    description: string
    content: string
    order: number
    duration?: number | null
    videoUrl?: string | null
  }
  onSubmit: (data: LessonFormData) => Promise<void>
  onCancel?: () => void
}

export function LessonForm({ courseId, lesson, onSubmit, onCancel }: LessonFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [csrfToken, setCsrfToken] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lesson
      ? {
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          order: lesson.order.toString(),
          duration: lesson.duration?.toString() || '',
          videoUrl: lesson.videoUrl || ''
        }
      : undefined
  })

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

  const onSubmitForm = async (data: LessonFormData) => {
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
        <h3 className='text-xl font-bold text-neutral-900'>{lesson ? 'تعديل الدرس' : 'إضافة درس جديد'}</h3>
        <p className='text-sm text-neutral-600'>املأ البيانات التالية لإضافة درس جديد للدورة.</p>
      </div>

      <form className='space-y-4' onSubmit={handleSubmit(onSubmitForm)}>
        <div className='grid gap-4 sm:grid-cols-2'>
          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            عنوان الدرس *
            <Input {...register('title')} state={errors.title ? 'error' : 'default'} placeholder='عنوان الدرس' />
            {errors.title && <span className='text-xs text-error'>{errors.title.message}</span>}
          </label>

          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            ترتيب الدرس *
            <Input
              type='number'
              {...register('order')}
              state={errors.order ? 'error' : 'default'}
              placeholder='1'
              min={1}
            />
            {errors.order && <span className='text-xs text-error'>{errors.order.message}</span>}
          </label>
        </div>

        <label className='space-y-2 text-sm font-semibold text-neutral-700'>
          وصف الدرس *
          <textarea
            {...register('description')}
            className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
            rows={2}
            placeholder='وصف مختصر للدرس'
          />
          {errors.description && <span className='text-xs text-error'>{errors.description.message}</span>}
        </label>

        <label className='space-y-2 text-sm font-semibold text-neutral-700'>
          محتوى الدرس *
          <textarea
            {...register('content')}
            className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
            rows={6}
            placeholder='محتوى الدرس (يمكن استخدام HTML أو Markdown)'
          />
          {errors.content && <span className='text-xs text-error'>{errors.content.message}</span>}
        </label>

        <div className='grid gap-4 sm:grid-cols-2'>
          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            مدة الدرس (بالدقائق)
            <Input
              type='number'
              {...register('duration')}
              state={errors.duration ? 'error' : 'default'}
              placeholder='60'
              min={1}
            />
            {errors.duration && <span className='text-xs text-error'>{errors.duration.message}</span>}
          </label>

          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            رابط الفيديو (اختياري)
            <Input
              {...register('videoUrl')}
              state={errors.videoUrl ? 'error' : 'default'}
              placeholder='https://youtube.com/...'
              type='url'
            />
            {errors.videoUrl && <span className='text-xs text-error'>{errors.videoUrl.message}</span>}
          </label>
        </div>

        <div className='flex gap-4'>
          <Button type='submit' disabled={isSubmitting || !csrfToken} className='flex-1'>
            {isSubmitting ? 'جاري الحفظ...' : lesson ? 'تحديث الدرس' : 'إضافة الدرس'}
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
