'use client'

import * as React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type ImageUploadProps = {
  value?: string
  onChange: (path: string) => void
  type?: 'course' | 'lesson'
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, type = 'course', label = 'صورة', className }: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [csrfToken, setCsrfToken] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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

  React.useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // عرض معاينة الصورة
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // رفع الصورة
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    if (!csrfToken) {
      alert('جاري تحميل رمز الحماية... يرجى الانتظار.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('csrfToken', csrfToken) // إضافة CSRF token إلى FormData

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-csrf-token': csrfToken // أيضاً في header للتوافق
        },
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء رفع الصورة')
      }

      const data = await response.json()
      onChange(data.path)
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الصورة')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className='text-sm font-semibold text-neutral-700'>{label}</label>
      
      {preview ? (
        <Card variant='bordered' className='relative p-4'>
          <div className='relative h-48 w-full overflow-hidden rounded-lg bg-neutral-100'>
            <Image
              src={preview}
              alt='Preview'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover'
            />
          </div>
          <div className='mt-4 flex gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'جاري الرفع...' : 'تغيير الصورة'}
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handleRemove}
              disabled={uploading}
              className='text-error hover:bg-error/10'
            >
              حذف
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          variant='bordered'
          className='flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-neutral-300 p-8 transition hover:border-primary'
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className='mb-4 h-12 w-12 text-neutral-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p className='text-sm font-semibold text-neutral-600'>
            {uploading ? 'جاري الرفع...' : 'انقر لرفع صورة'}
          </p>
          <p className='mt-1 text-xs text-neutral-500'>JPEG, PNG, WebP, GIF (حد أقصى 10MB)</p>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/jpg,image/png,image/webp,image/gif'
        onChange={handleFileSelect}
        className='hidden'
        disabled={uploading}
      />
    </div>
  )
}
