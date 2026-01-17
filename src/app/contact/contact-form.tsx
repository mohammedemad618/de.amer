'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function ContactForm({ contactEmail, contactPhone }: { contactEmail?: string; contactPhone?: string }) {
  const [status, setStatus] = React.useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('تم استلام رسالتك، سنعود إليك قريباً.')
  }

  return (
    <>
      <Card variant='elevated'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            الاسم الكامل
            <Input name='name' required placeholder='اكتب اسمك' />
          </label>
          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            البريد الإلكتروني
            <Input type='email' name='email' required placeholder='name@example.com' />
          </label>
          <label className='space-y-2 text-sm font-semibold text-neutral-700'>
            الرسالة
            <textarea
              name='message'
              required
              rows={5}
              className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus-ring'
              placeholder='كيف يمكننا مساعدتك؟'
            />
          </label>
          <Button type='submit'>إرسال الرسالة</Button>
          {status ? <p className='text-sm text-neutral-600'>{status}</p> : null}
        </form>
      </Card>
      <div className='space-y-6'>
        <Card variant='bordered' className='space-y-4'>
          <p className='text-sm font-semibold text-neutral-800'>تواصل سريع عبر واتساب</p>
          <p className='text-sm text-neutral-600'>احصل على رد فوري وساعدنا في تجهيز تفاصيلك بشكل أسرع.</p>
          {contactPhone && (
            <Button asChild variant='secondary'>
              <a href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`} target='_blank' rel='noreferrer'>
                محادثة عبر واتساب
              </a>
            </Button>
          )}
        </Card>
        <Card variant='glass' className='space-y-3'>
          <p className='text-sm font-semibold text-neutral-800'>قبل أن ترسل رسالتك</p>
          <ul className='space-y-2 text-sm text-neutral-600'>
            <li className='flex items-start gap-2'>
              <span className='mt-1 h-2 w-2 rounded-full bg-primary' aria-hidden='true' />
              <span>اذكر هدفك من الدورة لتحديد المسار المناسب لك.</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-1 h-2 w-2 rounded-full bg-primary' aria-hidden='true' />
              <span>شاركنا الخبرة السابقة إن وجدت لتصميم خطة مناسبة.</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-1 h-2 w-2 rounded-full bg-primary' aria-hidden='true' />
              <span>نرد على الاستفسارات خلال 24 ساعة عمل.</span>
            </li>
          </ul>
        </Card>
      </div>
    </>
  )
}
