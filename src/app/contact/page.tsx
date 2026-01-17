import * as React from 'react'
import { MedicalIllustration } from '@/components/illustrations/medical-illustration'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SectionHeading } from '@/components/ui/section-heading'
import { Reveal } from '@/components/ui/reveal'
import { Stagger, StaggerItem } from '@/components/ui/stagger'
import { getSettings } from '@/lib/settings'
import { ContactForm } from './contact-form'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const settings = await getSettings(['contact_email', 'contact_phone', 'contact_address'])
  const contactEmail = (settings.contact_email as string) || ''
  const contactPhone = (settings.contact_phone as string) || '+00963985391696'
  const contactAddress = (settings.contact_address as string) || 'دمشق - سوريا'

  const contactInfo = [
    { title: 'الهاتف', value: contactPhone, note: 'رد سريع خلال ساعات الدوام' },
    ...(contactAddress ? [{ title: 'الموقع', value: contactAddress, note: 'زيارات باستقبال مسبق' }] : []),
    { title: 'ساعات العمل', value: 'السبت - الخميس', note: '10:00 صباحاً - 6:00 مساءً' }
  ]

  return (
    <div className='space-y-12 pb-16'>
      <section className='relative overflow-hidden bg-hero-gradient'>
        <div
          className='pointer-events-none absolute -left-24 top-10 h-40 w-40 rounded-full bg-accent-green/25 blur-3xl'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-accent-turquoise/25 blur-3xl'
          aria-hidden='true'
        />
        <div className='mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2'>
          <Reveal className='space-y-6'>
            <SectionHeading title='تواصل معنا' subtitle='جاهزون لمساعدتك في اختيار المسار الأنسب لتطورك المهني.' />
            <Stagger className='grid gap-4 sm:grid-cols-2'>
              {contactInfo.map((item) => (
                <StaggerItem key={item.title}>
                  <Card variant='glass' className='space-y-2'>
                    <p className='text-sm font-semibold text-neutral-800'>{item.title}</p>
                    <p className='text-base font-bold text-neutral-900'>{item.value}</p>
                    <p className='text-xs text-neutral-600'>{item.note}</p>
                  </Card>
                </StaggerItem>
              ))}
              {contactEmail && (
                <StaggerItem>
                  <Card variant='glass' className='space-y-2'>
                    <p className='text-sm font-semibold text-neutral-800'>البريد الإلكتروني</p>
                    <p className='text-base font-bold text-neutral-900'>{contactEmail}</p>
                    <p className='text-xs text-neutral-600'>رد خلال 24 ساعة عمل</p>
                  </Card>
                </StaggerItem>
              )}
            </Stagger>
          </Reveal>
          <Reveal className='relative h-64 w-full' delay={0.1}>
            <MedicalIllustration id='consultationScene' />
          </Reveal>
        </div>
      </section>

      <section className='mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <ContactForm contactEmail={contactEmail} contactPhone={contactPhone} />
      </section>
    </div>
  )
}
