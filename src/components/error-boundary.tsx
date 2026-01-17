'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className='flex min-h-screen items-center justify-center p-6'>
          <Card variant='elevated' className='max-w-md space-y-4'>
            <div className='space-y-2'>
              <h2 className='text-xl font-bold text-neutral-900'>حدث خطأ غير متوقع</h2>
              <p className='text-sm text-neutral-600'>
                نعتذر، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className='mt-4 rounded bg-neutral-100 p-3 text-xs'>
                  <summary className='cursor-pointer font-semibold'>تفاصيل الخطأ (Development Only)</summary>
                  <pre className='mt-2 whitespace-pre-wrap break-words'>{this.state.error.toString()}</pre>
                  {this.state.error.stack && (
                    <pre className='mt-2 whitespace-pre-wrap break-words text-xs'>{this.state.error.stack}</pre>
                  )}
                </details>
              )}
            </div>
            <div className='flex gap-3'>
              <Button onClick={this.resetError} variant='primary'>
                إعادة المحاولة
              </Button>
              <Button onClick={() => window.location.href = '/'} variant='outline'>
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
