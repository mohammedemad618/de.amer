import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type CertificateInfo = {
  courseTitle: string
  certificateUrl: string
  certificateId: string
  completedAt?: Date
}

export function CertificateCard({ certificate }: { certificate: CertificateInfo }) {
  return (
    <Card variant='elevated' className='group relative overflow-hidden transition-all hover:shadow-lg'>
      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-orange/10 blur-2xl' />
      <div className='relative space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-2 flex-1'>
            <div className='flex items-center gap-2'>
              <Badge variant='success' className='text-xs'>
                شهادة معتمدة
              </Badge>
            </div>
            <h3 className='text-lg font-bold text-neutral-900'>{certificate.courseTitle}</h3>
            <p className='text-xs text-neutral-500 font-mono'>{certificate.certificateId}</p>
            {certificate.completedAt && (
              <p className='text-xs text-neutral-500'>
                تاريخ الإتمام:{' '}
                {new Date(certificate.completedAt).toLocaleDateString('ar', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
          <div className='shrink-0'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-accent-orange/10 text-accent-orange'>
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
          </div>
        </div>
        <Button asChild variant='primary' className='w-full'>
          <Link href={certificate.certificateUrl} target='_blank' rel='noopener noreferrer'>
            <svg className='mr-2 h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            تحميل الشهادة PDF
          </Link>
        </Button>
      </div>
    </Card>
  )
}


