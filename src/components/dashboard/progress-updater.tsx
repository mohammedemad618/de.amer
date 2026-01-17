'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ProgressBar } from './progress-bar'

export function ProgressUpdater({ courseId, initialProgress }: { courseId: string; initialProgress: number }) {
  const [progress, setProgress] = React.useState(initialProgress)
  const [saving, setSaving] = React.useState(false)
  const [csrfToken, setCsrfToken] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadToken() {
      const response = await fetch('/api/auth/csrf')
      const data = await response.json()
      setCsrfToken(data.csrfToken)
    }
    loadToken()
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/progress', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ courseId, progressPercent: progress })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'تعذر تحديث التقدم')
      }
      setMessage('تم تحديث التقدم بنجاح.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر تحديث التقدم')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='space-y-3'>
      <ProgressBar value={progress} showLabel size='lg' variant={progress === 100 ? 'success' : 'primary'} />
      <div className='flex items-center gap-4 text-sm text-neutral-600'>
        <input
          type='range'
          min={0}
          max={100}
          value={progress}
          onChange={(event) => setProgress(Number(event.target.value))}
          className='h-2 w-full accent-primary'
          aria-label='تحديث نسبة التقدم'
        />
        <span className='font-semibold'>{progress}%</span>
      </div>
      <Button size='sm' onClick={handleSave} disabled={saving} className='w-full'>
        {saving ? 'جارٍ الحفظ...' : 'حفظ التقدم'}
      </Button>
      {message && (
        <p className={`text-xs ${message.includes('نجاح') ? 'text-accent-green' : 'text-accent-orange'}`}>
          {message}
        </p>
      )}
    </div>
  )
}


