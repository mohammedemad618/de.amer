import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

type TimelineEvent = {
  id: string
  title: string
  description: string
  date: Date
  type: 'enrollment' | 'progress' | 'completion' | 'certificate'
  courseTitle?: string
}

type ProgressTimelineProps = {
  events: TimelineEvent[]
}

const eventIcons = {
  enrollment: (
    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
    </svg>
  ),
  progress: (
    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
    </svg>
  ),
  completion: (
    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
    </svg>
  ),
  certificate: (
    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
    </svg>
  )
}

const eventColors = {
  enrollment: 'bg-accent-turquoise/10 text-accent-turquoise border-accent-turquoise/20',
  progress: 'bg-primary/10 text-primary border-primary/20',
  completion: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  certificate: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
}

const eventLabels = {
  enrollment: 'تسجيل',
  progress: 'تقدم',
  completion: 'إتمام',
  certificate: 'شهادة'
}

export function ProgressTimeline({ events }: ProgressTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (sortedEvents.length === 0) {
    return (
      <Card variant='elevated' className='p-8 text-center'>
        <p className='text-sm text-neutral-500'>لا توجد أحداث حتى الآن</p>
      </Card>
    )
  }

  return (
    <Card variant='elevated' className='space-y-4'>
      <div className='space-y-1'>
        <h3 className='text-lg font-bold text-neutral-900'>سجل التقدم</h3>
        <p className='text-sm text-neutral-600'>آخر الأنشطة والإنجازات</p>
      </div>
      <div className='relative space-y-6'>
        {sortedEvents.map((event, index) => (
          <div key={event.id} className='relative flex gap-4'>
            {/* Timeline line */}
            {index < sortedEvents.length - 1 && (
              <div className='absolute right-2 top-6 h-full w-0.5 bg-neutral-200' />
            )}
            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                eventColors[event.type]
              )}
            >
              {eventIcons[event.type]}
            </div>
            {/* Content */}
            <div className='flex-1 space-y-1 pb-6'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-neutral-900'>{event.title}</p>
                    <Badge variant='neutral' className='text-xs'>
                      {eventLabels[event.type]}
                    </Badge>
                  </div>
                  {event.courseTitle && (
                    <p className='text-sm text-neutral-600'>{event.courseTitle}</p>
                  )}
                  <p className='text-sm text-neutral-500'>{event.description}</p>
                </div>
                <span className='shrink-0 text-xs text-neutral-400'>
                  {new Date(event.date).toLocaleDateString('ar', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
