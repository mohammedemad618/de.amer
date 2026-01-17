'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MedicalIllustration } from '@/components/illustrations/medical-illustration'
import { Reveal } from '@/components/ui/reveal'

const schema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور قصيرة جداً')
})

type LoginForm = z.infer<typeof schema>

const highlights = [
  { title: 'تتبع تقدمك', desc: 'اطّلع على تقدمك في الدورات والشهادات المكتسبة.' },
  { title: 'محتوى مخصص', desc: 'تابع الدورات المناسبة لاهتماماتك المهنية.' },
  { title: 'تحديثات مستمرة', desc: 'احصل على تنبيهات بالمحتوى الجديد فور توفره.' },
  { title: 'دعم احترافي', desc: 'تواصل مع فريقنا لأي استفسار أثناء التعلم.' }
]

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [csrfToken, setCsrfToken] = React.useState('')
  const [csrfLoading, setCsrfLoading] = React.useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ resolver: zodResolver(schema) })

  React.useEffect(() => {
    async function loadToken() {
      try {
        const response = await fetch('/api/auth/csrf', {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error('فشل تحميل رمز الحماية')
        }
        const data = await response.json()
        setCsrfToken(data.csrfToken)
      } catch (error) {
        console.error('خطأ في تحميل CSRF token:', error)
        setServerError('فشل تحميل رمز الحماية. يرجى تحديث الصفحة.')
      } finally {
        setCsrfLoading(false)
      }
    }
    loadToken()
  }, [])

  const onSubmit = async (values: LoginForm) => {
    if (!csrfToken) {
      setServerError('جاري تحميل رمز الحماية... يرجى الانتظار.')
      return
    }

    setServerError(null)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      
      let data
      try {
        const text = await response.text()
        data = JSON.parse(text)
      } catch (parseError) {
        console.error('خطأ في معالجة الاستجابة:', parseError)
        setServerError('خطأ في معالجة الاستجابة من السيرفر')
        return
      }
      
      if (!response.ok) {
        setServerError(data.message ?? 'حدث خطأ أثناء تسجيل الدخول')
        return
      }
      
      // إعادة تحميل CSRF token بعد تسجيل الدخول الناجح
      const csrfResponse = await fetch('/api/auth/csrf', {
        credentials: 'include'
      })
      if (csrfResponse.ok) {
        const csrfData = await csrfResponse.json()
        setCsrfToken(csrfData.csrfToken)
      }
      
      // إعادة تحميل server components لقراءة cookies الجديدة
      router.refresh()
      
      // الانتظار قليلاً قبل إعادة التوجيه لضمان تحديث cookies
      await new Promise(resolve => setTimeout(resolve, 100))
      
      router.push('/dashboard')
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error)
      setServerError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
    }
  }

  return (
    <div className='relative overflow-hidden bg-hero-gradient'>
      <div
        className='pointer-events-none absolute -left-24 top-12 h-40 w-40 rounded-full bg-accent-purple/25 blur-3xl'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-accent-turquoise/25 blur-3xl'
        aria-hidden='true'
      />
      <div className='mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]'>
        <Reveal className='space-y-6'>
          <p className='text-sm font-semibold text-primary'>أهلاً بعودتك</p>
          <h1 className='text-3xl font-bold leading-tight text-neutral-900 md:text-5xl'>تسجيل الدخول</h1>
          <p className='text-lg text-neutral-600'>تابع تقدمك وادخل إلى لوحة التحكم الخاصة بك بسهولة.</p>
          <div className='grid gap-4 sm:grid-cols-2'>
            {highlights.map((item) => (
              <Card key={item.title} variant='glass' className='space-y-2'>
                <p className='text-sm font-semibold text-neutral-800'>{item.title}</p>
                <p className='text-xs text-neutral-600'>{item.desc}</p>
              </Card>
            ))}
          </div>
          <div className='relative h-48 w-full'>
            <MedicalIllustration id='doctorClipboard' />
          </div>
          <p className='text-sm text-neutral-600'>
            لا تملك حساباً؟{' '}
            <Link href='/auth/register' className='font-semibold text-primary hover:underline'>
              إنشاء حساب جديد
            </Link>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Card variant='elevated' className='w-full space-y-6'>
            <div className='space-y-2'>
              <p className='text-sm font-semibold text-primary'>بيانات الدخول</p>
              <p className='text-2xl font-bold text-neutral-900'>ابدأ جلستك الآن</p>
              <p className='text-sm text-neutral-600'>أدخل بريدك وكلمة المرور للمتابعة.</p>
            </div>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
              <label className='space-y-2 text-sm font-semibold text-neutral-700'>
                البريد الإلكتروني
                <Input
                  type='email'
                  placeholder='name@example.com'
                  {...register('email')}
                  state={errors.email ? 'error' : 'default'}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email ? (
                  <span id='email-error' role='alert' className='text-xs text-error'>
                    {errors.email.message}
                  </span>
                ) : null}
              </label>
              <label className='space-y-2 text-sm font-semibold text-neutral-700'>
                كلمة المرور
                <Input
                  type='password'
                  placeholder='••••••••'
                  {...register('password')}
                  state={errors.password ? 'error' : 'default'}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password ? (
                  <span id='password-error' role='alert' className='text-xs text-error'>
                    {errors.password.message}
                  </span>
                ) : null}
              </label>
              {serverError ? (
                <p className='text-sm text-error' role='alert'>
                  {serverError}
                </p>
              ) : null}
              <Button type='submit' disabled={isSubmitting || csrfLoading || !csrfToken}>
                {csrfLoading
                  ? 'جاري التحميل...'
                  : isSubmitting
                    ? 'جارٍ تسجيل الدخول...'
                    : 'تسجيل الدخول'}
              </Button>
            </form>
          </Card>
        </Reveal>
      </div>
    </div>
  )
}
