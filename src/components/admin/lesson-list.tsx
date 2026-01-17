'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LessonForm } from './lesson-form'

type Lesson = {
  id: string
  title: string
  description: string
  content: string
  order: number
  duration?: number | null
  videoUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

type LessonListProps = {
  courseId: string
  lessons: Lesson[]
  onUpdate: () => void
}

export function LessonList({ courseId, lessons, onUpdate }: LessonListProps) {
  const [editingLesson, setEditingLesson] = React.useState<Lesson | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [csrfToken, setCsrfToken] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

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

  const handleCreate = async (data: any) => {
    if (!csrfToken) return

    try {
      const response = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          courseId,
          order: Number(data.order),
          duration: data.duration ? Number(data.duration) : null,
          videoUrl: data.videoUrl || null
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء إنشاء الدرس')
      }

      onUpdate()
      setShowForm(false)
      alert('تم إنشاء الدرس بنجاح!')
    } catch (error) {
      console.error('خطأ في إنشاء الدرس:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الدرس')
    }
  }

  const handleUpdate = async (data: any) => {
    if (!csrfToken || !editingLesson) return

    try {
      const response = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          order: Number(data.order),
          duration: data.duration ? Number(data.duration) : null,
          videoUrl: data.videoUrl || null
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء تحديث الدرس')
      }

      onUpdate()
      setEditingLesson(null)
      alert('تم تحديث الدرس بنجاح!')
    } catch (error) {
      console.error('خطأ في تحديث الدرس:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الدرس')
    }
  }

  const handleDelete = async (lessonId: string) => {
    if (!csrfToken || !confirm('هل أنت متأكد من حذف هذا الدرس؟')) return

    setIsDeleting(lessonId)
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': csrfToken
        },
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء حذف الدرس')
      }

      onUpdate()
      alert('تم حذف الدرس بنجاح!')
    } catch (error) {
      console.error('خطأ في حذف الدرس:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء حذف الدرس')
    } finally {
      setIsDeleting(null)
    }
  }

  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order)

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-bold text-neutral-900'>دروس الدورة ({lessons.length})</h3>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingLesson(null)
          }}
          disabled={showForm || editingLesson !== null}
          size='sm'
        >
          + إضافة درس جديد
        </Button>
      </div>

      {(showForm || editingLesson) && (
        <LessonForm
          courseId={courseId}
          lesson={editingLesson || undefined}
          onSubmit={editingLesson ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setEditingLesson(null)
          }}
        />
      )}

      {sortedLessons.length === 0 ? (
        <Card variant='bordered' className='p-8 text-center'>
          <p className='text-sm text-neutral-500'>لا توجد دروس حالياً. ابدأ بإضافة درس جديد.</p>
        </Card>
      ) : (
        <div className='space-y-3'>
          {sortedLessons.map((lesson) => (
            <Card key={lesson.id} variant='bordered' className='p-4'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1 space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='info'>{lesson.order}</Badge>
                    <h4 className='font-bold text-neutral-900'>{lesson.title}</h4>
                  </div>
                  <p className='text-sm text-neutral-600 line-clamp-2'>{lesson.description}</p>
                  <div className='flex flex-wrap gap-2 text-xs text-neutral-500'>
                    {lesson.duration && <span>⏱️ {lesson.duration} دقيقة</span>}
                    {lesson.videoUrl && <span>🎥 فيديو متوفر</span>}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditingLesson(lesson)
                      setShowForm(false)
                    }}
                    disabled={showForm || editingLesson !== null}
                  >
                    تعديل
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDelete(lesson.id)}
                    disabled={isDeleting === lesson.id || showForm || editingLesson !== null}
                    className='text-error hover:bg-error/10'
                  >
                    {isDeleting === lesson.id ? 'جاري الحذف...' : 'حذف'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
