'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

type LogoutButtonProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  showError?: boolean
}

export function LogoutButton({ className, size = 'sm', variant = 'outline', showError = false }: LogoutButtonProps) {
  const router = useRouter()
  const [csrfToken, setCsrfToken] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadToken() {
      const response = await fetch('/api/auth/csrf')
      const data = await response.json()
      setCsrfToken(data.csrfToken)
    }
    loadToken()
  }, [])

  async function ensureCsrfToken() {
    if (csrfToken) {
      return csrfToken
    }
    const response = await fetch('/api/auth/csrf')
    const data = await response.json()
    setCsrfToken(data.csrfToken)
    return data.csrfToken as string
  }

  async function handleLogout() {
    setLoading(true)
    setError(null)
    try {
      const token = await ensureCsrfToken()
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'x-csrf-token': token
        },
        credentials: 'include'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message ?? 'تعذر تسجيل الخروج')
      }
      router.refresh()
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تسجيل الخروج')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Button onClick={handleLogout} size={size} variant={variant} isLoading={loading}>
        {loading ? 'جارٍ تسجيل الخروج...' : 'تسجيل الخروج'}
      </Button>
      {showError && error ? (
        <p className='text-xs text-error' role='alert'>
          {error}
        </p>
      ) : null}
    </div>
  )
}
