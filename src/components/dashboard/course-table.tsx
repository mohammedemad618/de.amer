'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from './progress-bar'
import { cn } from '@/lib/utils/cn'

type Enrollment = {
  id: string
  courseId: string
  status: string
  progressPercent: number
  course: {
    id: string
    title: string
    category: string
    hours: number
    level: string
  }
  updatedAt: Date
}

type CourseTableProps = {
  enrollments: Enrollment[]
}

type SortField = 'title' | 'progress' | 'updated' | 'category'
type SortDirection = 'asc' | 'desc'

export function CourseTable({ enrollments }: CourseTableProps) {
  const [sortField, setSortField] = React.useState<SortField>('updated')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')
  const [filterStatus, setFilterStatus] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSorted = React.useMemo(() => {
    let filtered = enrollments

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((e) => e.status === filterStatus)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.course.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'title':
          aValue = a.course.title
          bValue = b.course.title
          break
        case 'progress':
          aValue = a.progressPercent
          bValue = b.progressPercent
          break
        case 'updated':
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        case 'category':
          aValue = a.course.category
          bValue = b.course.category
          break
        default:
          return 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

    return filtered
  }, [enrollments, sortField, sortDirection, filterStatus, searchQuery])

  const statusCounts = React.useMemo(() => {
    return {
      all: enrollments.length,
      ACTIVE: enrollments.filter((e) => e.status === 'ACTIVE').length,
      COMPLETED: enrollments.filter((e) => e.status === 'COMPLETED').length
    }
  }, [enrollments])

  return (
    <Card variant='elevated' className='overflow-hidden'>
      {/* Filters and Search */}
      <div className='border-b border-neutral-200 bg-neutral-50/50 p-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-wrap gap-2'>
            {(['all', 'ACTIVE', 'COMPLETED'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'primary' : 'outline'}
                size='sm'
                onClick={() => setFilterStatus(status)}
                className='text-xs'
              >
                {status === 'all' ? 'الكل' : status === 'ACTIVE' ? 'نشطة' : 'مكتملة'} ({statusCounts[status]})
              </Button>
            ))}
          </div>
          <input
            type='text'
            placeholder='بحث في الدورات...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
          />
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-neutral-50'>
            <tr>
              <th className='px-4 py-3 text-right text-xs font-semibold text-neutral-600'>
                <button
                  onClick={() => handleSort('title')}
                  className='flex items-center gap-1 hover:text-primary'
                >
                  الدورة
                  {sortField === 'title' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </button>
              </th>
              <th className='px-4 py-3 text-right text-xs font-semibold text-neutral-600'>
                <button
                  onClick={() => handleSort('category')}
                  className='flex items-center gap-1 hover:text-primary'
                >
                  الفئة
                  {sortField === 'category' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </button>
              </th>
              <th className='px-4 py-3 text-right text-xs font-semibold text-neutral-600'>
                <button
                  onClick={() => handleSort('progress')}
                  className='flex items-center gap-1 hover:text-primary'
                >
                  التقدم
                  {sortField === 'progress' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </button>
              </th>
              <th className='px-4 py-3 text-right text-xs font-semibold text-neutral-600'>
                <button
                  onClick={() => handleSort('updated')}
                  className='flex items-center gap-1 hover:text-primary'
                >
                  آخر تحديث
                  {sortField === 'updated' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </button>
              </th>
              <th className='px-4 py-3 text-right text-xs font-semibold text-neutral-600'>الحالة</th>
              <th className='px-4 py-3 text-right text-xs font-semibold text-neutral-600'>الإجراءات</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-100'>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-4 py-8 text-center text-sm text-neutral-500'>
                  لا توجد دورات مطابقة للبحث
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((enrollment) => (
                <tr key={enrollment.id} className='transition-colors hover:bg-neutral-50'>
                  <td className='px-4 py-3'>
                    <Link
                      href={`/courses/${enrollment.courseId}`}
                      className='font-semibold text-neutral-900 hover:text-primary'
                    >
                      {enrollment.course.title}
                    </Link>
                  </td>
                  <td className='px-4 py-3 text-sm text-neutral-600'>{enrollment.course.category}</td>
                  <td className='px-4 py-3'>
                    <div className='space-y-1'>
                      <ProgressBar value={enrollment.progressPercent} />
                      <span className='text-xs text-neutral-500'>{enrollment.progressPercent}%</span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-xs text-neutral-500'>
                    {new Date(enrollment.updatedAt).toLocaleDateString('ar', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className='px-4 py-3'>
                    <Badge
                      variant={enrollment.status === 'COMPLETED' ? 'success' : 'info'}
                      className='text-xs'
                    >
                      {enrollment.status === 'COMPLETED' ? 'مكتملة' : 'نشطة'}
                    </Badge>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-2'>
                      <Button asChild size='sm' variant='outline'>
                        <Link href={`/courses/${enrollment.courseId}`}>متابعة</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
