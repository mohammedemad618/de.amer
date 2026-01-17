import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/guards'
import { SettingsClient } from '@/components/admin/settings-client'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/auth/login')
  }

  return (
    <div className='space-y-8 pb-16'>
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-10 h-40 w-40 rounded-full bg-accent-purple/20 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto max-w-7xl space-y-6 px-6 py-12'>
          <div className='space-y-2'>
            <p className='text-sm font-semibold text-primary'>لوحة تحكم المسؤول</p>
            <h1 className='text-3xl font-bold text-neutral-900 md:text-4xl'>إعدادات النظام</h1>
            <p className='text-lg text-neutral-600'>قم بإدارة إعدادات النظام العامة.</p>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-4xl px-6'>
        <SettingsClient />
      </section>
    </div>
  )
}
