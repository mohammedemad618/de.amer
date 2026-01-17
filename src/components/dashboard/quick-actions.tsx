import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

type QuickAction = {
  label: string
  href: string
  icon: React.ReactNode
  variant?: 'primary' | 'outline'
  description?: string
}

const quickActions: QuickAction[] = [
  {
    label: 'استكشف الدورات',
    href: '/courses',
    icon: (
      <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
      </svg>
    ),
    variant: 'primary',
    description: 'تصفح جميع الدورات المتاحة'
  },
  {
    label: 'تواصل معنا',
    href: '/contact',
    icon: (
      <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
      </svg>
    ),
    variant: 'outline',
    description: 'احصل على المساعدة والدعم'
  },
  {
    label: 'من نحن',
    href: '/about',
    icon: (
      <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
      </svg>
    ),
    variant: 'outline',
    description: 'تعرف على منصة أمار'
  }
]

export function QuickActions() {
  return (
    <Card variant='elevated' className='space-y-4'>
      <div className='space-y-1'>
        <h3 className='text-lg font-bold text-neutral-900'>إجراءات سريعة</h3>
        <p className='text-sm text-neutral-600'>الوصول السريع للميزات الرئيسية</p>
      </div>
      <div className='grid gap-3 sm:grid-cols-3'>
        {quickActions.map((action) => (
          <Button
            key={action.href}
            asChild
            variant={action.variant}
            className={cn(
              'flex h-auto flex-col items-start gap-2 p-4 text-right',
              action.variant === 'primary' && 'bg-primary text-white hover:bg-indigo-600'
            )}
          >
            <Link href={action.href}>
              <div className='flex items-center gap-2'>
                {action.icon}
                <span className='font-semibold'>{action.label}</span>
              </div>
              {action.description && (
                <p className={cn('text-xs', action.variant === 'primary' ? 'text-white/80' : 'text-neutral-500')}>
                  {action.description}
                </p>
              )}
            </Link>
          </Button>
        ))}
      </div>
    </Card>
  )
}
