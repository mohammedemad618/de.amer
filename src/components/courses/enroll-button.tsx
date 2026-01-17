'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

export function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [csrfToken, setCsrfToken] = React.useState('')

  React.useEffect(() => {
    async function loadToken() {
      const response = await fetch('/api/auth/csrf')
      const data = await response.json()
      setCsrfToken(data.csrfToken)
    }
    loadToken()
  }, [])

  async function handleEnroll() {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ courseId })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'تعذر التسجيل')
      }
      setMessage('تم تسجيلك في الدورة بنجاح.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر التسجيل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-2'>
      <Button onClick={handleEnroll} disabled={loading}>
        {loading ? 'جارٍ التسجيل...' : 'سجّل في الدورة'}
      </Button>
      {message ? <p className='text-sm text-neutral-600'>{message}</p> : null}
    </div>
  )
}


