'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CourseForm } from './course-form'
import { LessonList } from './lesson-list'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Course = {
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
  createdAt: Date
  updatedAt: Date
  enrollments: Array<{
    id: string
    status: string
    progressPercent: number
  }>
}

type CoursesAdminClientProps = {
  courses: Course[]
}

export function CoursesAdminClient({ courses: initialCourses }: CoursesAdminClientProps) {
  const router = useRouter()
  const [courses, setCourses] = React.useState(initialCourses)
  const [showForm, setShowForm] = React.useState(false)
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null)
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
  const [lessons, setLessons] = React.useState<Record<string, any[]>>({})
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

  const loadLessons = React.useCallback(async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/lessons?courseId=${courseId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setLessons((prev) => ({ ...prev, [courseId]: data.lessons }))
      }
    } catch (error) {
      console.error('خطأ في تحميل الدروس:', error)
    }
  }, [])

  React.useEffect(() => {
    if (selectedCourseId) {
      loadLessons(selectedCourseId)
    }
  }, [selectedCourseId, loadLessons])

  const handleCreate = async (data: any) => {
    if (!csrfToken) return

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء إنشاء الدورة')
      }

      router.refresh()
      setShowForm(false)
      alert('تم إنشاء الدورة بنجاح!')
    } catch (error) {
      console.error('خطأ في إنشاء الدورة:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الدورة')
    }
  }

  const handleUpdate = async (data: any) => {
    if (!csrfToken || !editingCourse) return

    try {
      const response = await fetch(`/api/admin/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء تحديث الدورة')
      }

      router.refresh()
      setEditingCourse(null)
      alert('تم تحديث الدورة بنجاح!')
    } catch (error) {
      console.error('خطأ في تحديث الدورة:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الدورة')
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!csrfToken || !confirm('هل أنت متأكد من حذف هذه الدورة؟')) return

    setIsDeleting(courseId)
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': csrfToken
        },
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء حذف الدورة')
      }

      router.refresh()
      alert('تم حذف الدورة بنجاح!')
    } catch (error) {
      console.error('خطأ في حذف الدورة:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء حذف الدورة')
    } finally {
      setIsDeleting(null)
    }
  }

  const levelLabels: Record<string, string> = {
    BEGINNER: 'مبتدئ',
    INTERMEDIATE: 'متوسط',
    ADVANCED: 'متقدم'
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-neutral-900'>الدورات ({courses.length})</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingCourse(null)
          }}
          disabled={showForm || editingCourse !== null}
        >
          + إضافة دورة جديدة
        </Button>
      </div>

      {(showForm || editingCourse) && (
        <CourseForm
          course={editingCourse || undefined}
          onSubmit={editingCourse ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setEditingCourse(null)
          }}
        />
      )}

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {courses.map((course) => (
          <Card key={course.id} variant='bordered' className='space-y-4 p-6'>
            <div className='space-y-2'>
              <div className='flex items-start justify-between gap-2'>
                <h3 className='text-lg font-bold text-neutral-900'>{course.title}</h3>
                <Badge variant={course.level === 'ADVANCED' ? 'error' : course.level === 'INTERMEDIATE' ? 'warning' : 'info'}>
                  {levelLabels[course.level] || course.level}
                </Badge>
              </div>
              <p className='text-sm text-neutral-600'>{course.category}</p>
              <p className='text-xs text-neutral-500 line-clamp-2'>{course.description}</p>
            </div>

            <div className='flex flex-wrap gap-2 text-xs text-neutral-600'>
              <span>{course.hours} ساعة</span>
              <span>•</span>
              <span>{course.price === 0 ? 'مجاني' : `${course.price} ريال`}</span>
              <span>•</span>
              <span>{course.enrollments.length} طالب</span>
            </div>

            {course.meetingLink && (
              <div className='rounded-lg bg-primary/10 p-2'>
                <p className='text-xs font-semibold text-primary'>رابط الاجتماع متوفر</p>
              </div>
            )}

            <div className='flex flex-col gap-2'>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setEditingCourse(course)
                    setShowForm(false)
                  }}
                  disabled={showForm || editingCourse !== null || selectedCourseId !== null}
                  className='flex-1'
                >
                  تعديل
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDelete(course.id)}
                  disabled={isDeleting === course.id || showForm || editingCourse !== null || selectedCourseId !== null}
                  className='text-error hover:bg-error/10'
                >
                  {isDeleting === course.id ? 'جاري الحذف...' : 'حذف'}
                </Button>
              </div>
              <Button
                variant='secondary'
                size='sm'
                onClick={() => {
                  setSelectedCourseId(selectedCourseId === course.id ? null : course.id)
                  setShowForm(false)
                  setEditingCourse(null)
                }}
                disabled={showForm || editingCourse !== null}
                className='w-full'
              >
                {selectedCourseId === course.id ? 'إخفاء الدروس' : `إدارة الدروس (${lessons[course.id]?.length || 0})`}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card variant='bordered' className='p-8 text-center'>
          <p className='text-sm text-neutral-500'>لا توجد دورات حالياً. ابدأ بإضافة دورة جديدة.</p>
        </Card>
      )}

      {selectedCourseId && (
        <Card variant='elevated' className='p-6'>
          <LessonList
            courseId={selectedCourseId}
            lessons={lessons[selectedCourseId] || []}
            onUpdate={() => loadLessons(selectedCourseId)}
          />
        </Card>
      )}
    </div>
  )
}
