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
  name: z.string().min(2, 'الاسم قصير جداً'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور قصيرة جداً')
})

type RegisterForm = z.infer<typeof schema>

const highlights = [
  { title: 'خطة تعلم واضحة', desc: 'نساعدك على اختيار المسار الأنسب لهدفك.' },
  { title: 'إنجازات موثقة', desc: 'احصل على شهادات عند إكمال الدورات.' },
  { title: 'متابعة مرنة', desc: 'تعلم في أي وقت مع تقدم محفوظ.' },
  { title: 'دعم مستمر', desc: 'فريقنا جاهز لأي استفسار خلال رحلتك.' }
]

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [csrfToken, setCsrfToken] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) })

  React.useEffect(() => {
    async function loadToken() {
      const response = await fetch('/api/auth/csrf')
      const data = await response.json()
      setCsrfToken(data.csrfToken)
    }
    loadToken()
  }, [])

  const onSubmit = async (values: RegisterForm) => {
    setServerError(null)
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify(values)
    })

    const data = await response.json()
    if (!response.ok) {
      setServerError(data.message ?? 'حدث خطأ أثناء إنشاء الحساب')
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className='relative overflow-hidden bg-hero-gradient'>
      <div
        className='pointer-events-none absolute -left-24 top-12 h-40 w-40 rounded-full bg-accent-green/25 blur-3xl'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-accent-orange/25 blur-3xl'
        aria-hidden='true'
      />
      <div className='mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]'>
        <Reveal className='space-y-6'>
          <p className='text-sm font-semibold text-primary'>ابدأ رحلتك المهنية</p>
          <h1 className='text-3xl font-bold leading-tight text-neutral-900 md:text-5xl'>إنشاء حساب جديد</h1>
          <p className='text-lg text-neutral-600'>أنشئ حسابك وابدأ التعلم ضمن مسارات مصممة بعناية.</p>
          <div className='grid gap-4 sm:grid-cols-2'>
            {highlights.map((item) => (
              <Card key={item.title} variant='glass' className='space-y-2'>
                <p className='text-sm font-semibold text-neutral-800'>{item.title}</p>
                <p className='text-xs text-neutral-600'>{item.desc}</p>
              </Card>
            ))}
          </div>
          <div className='relative h-48 w-full'>
            <MedicalIllustration id='nutritionist' />
          </div>
          <p className='text-sm text-neutral-600'>
            لديك حساب بالفعل؟{' '}
            <Link href='/auth/login' className='font-semibold text-primary hover:underline'>
              تسجيل الدخول
            </Link>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Card variant='elevated' className='w-full space-y-6'>
            <div className='space-y-2'>
              <p className='text-sm font-semibold text-primary'>بيانات التسجيل</p>
              <p className='text-2xl font-bold text-neutral-900'>ابدأ الآن</p>
              <p className='text-sm text-neutral-600'>املأ بياناتك لإنشاء حساب جديد.</p>
            </div>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
              <label className='space-y-2 text-sm font-semibold text-neutral-700'>
                الاسم الكامل
                <Input
                  placeholder='اكتب اسمك'
                  {...register('name')}
                  state={errors.name ? 'error' : 'default'}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name ? (
                  <span id='name-error' role='alert' className='text-xs text-error'>
                    {errors.name.message}
                  </span>
                ) : null}
              </label>
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
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
              </Button>
            </form>
          </Card>
        </Reveal>
      </div>
    </div>
  )
}
