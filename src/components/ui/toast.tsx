'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Alert } from './alert'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

type Toast = {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

type ToastContextType = {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((message: string, variant: ToastVariant = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, variant, duration }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className='pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-2 p-4 md:left-auto md:right-4 md:top-4 md:bottom-auto'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className='pointer-events-auto animate-slide-in-from-bottom animate-fade-in md:animate-slide-in-from-top'
          >
            <Alert variant={toast.variant} className='min-w-[300px] shadow-lg'>
              <div className='flex items-center justify-between gap-4'>
                <p>{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className='flex-shrink-0 text-current opacity-70 transition-opacity hover:opacity-100'
                  aria-label='إغلاق'
                >
                  <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </Alert>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
