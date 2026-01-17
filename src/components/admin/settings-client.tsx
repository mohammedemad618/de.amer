'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert } from '@/components/ui/alert'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils/cn'

type Setting = {
  id: string
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'json'
  category: string
  updatedAt: Date
  updatedBy?: string | null
}

type DefaultSetting = {
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'json'
  category: string
  label: string
  description?: string
  icon?: string
}

const defaultSettings: DefaultSetting[] = [
  // General Settings
  {
    key: 'site_name',
    value: 'أمار للتعليم الطبي',
    type: 'string',
    category: 'general',
    label: 'اسم الموقع',
    description: 'اسم المنصة الذي يظهر في جميع صفحات الموقع',
    icon: '🏥'
  },
  {
    key: 'site_description',
    value: 'منصة عربية لتطوير المهارات المهنية في التغذية العلاجية والعلاج الوظيفي',
    type: 'string',
    category: 'general',
    label: 'وصف الموقع',
    description: 'وصف مختصر يظهر في نتائج البحث و Open Graph',
    icon: '📝'
  },
  {
    key: 'site_url',
    value: 'https://amar-medical.com',
    type: 'string',
    category: 'general',
    label: 'رابط الموقع',
    description: 'الرابط الرئيسي للموقع (يستخدم في SEO و Open Graph)',
    icon: '🔗'
  },
  {
    key: 'enable_registrations',
    value: true,
    type: 'boolean',
    category: 'general',
    label: 'تفعيل التسجيلات',
    description: 'تفعيل أو تعطيل إمكانية التسجيل في المنصة',
    icon: '🔐'
  },
  // Contact Settings
  {
    key: 'contact_email',
    value: 'info@amar-medical.com',
    type: 'string',
    category: 'contact',
    label: 'البريد الإلكتروني',
    description: 'البريد الإلكتروني الرئيسي للتواصل',
    icon: '📧'
  },
  {
    key: 'contact_phone',
    value: '+966500000000',
    type: 'string',
    category: 'contact',
    label: 'رقم الهاتف',
    description: 'رقم الهاتف الرئيسي للتواصل',
    icon: '📱'
  },
  {
    key: 'contact_address',
    value: 'دمشق - سوريا',
    type: 'string',
    category: 'contact',
    label: 'العنوان',
    description: 'العنوان الفعلي للمنصة',
    icon: '📍'
  },
  // SEO Settings
  {
    key: 'meta_keywords',
    value: 'تعليم طبي, تغذية علاجية, علاج وظيفي, دورات طبية',
    type: 'string',
    category: 'seo',
    label: 'كلمات مفتاحية',
    description: 'الكلمات المفتاحية المستخدمة في SEO (مفصولة بفواصل)',
    icon: '🔍'
  },
  {
    key: 'og_image',
    value: '',
    type: 'string',
    category: 'seo',
    label: 'صورة Open Graph',
    description: 'رابط الصورة التي تظهر عند مشاركة الموقع على وسائل التواصل',
    icon: '🖼️'
  },
  // Social Media Settings
  {
    key: 'social_facebook',
    value: '',
    type: 'string',
    category: 'social',
    label: 'فيسبوك',
    description: 'رابط صفحة فيسبوك',
    icon: '📘'
  },
  {
    key: 'social_twitter',
    value: '',
    type: 'string',
    category: 'social',
    label: 'تويتر',
    description: 'رابط حساب تويتر',
    icon: '🐦'
  },
  {
    key: 'social_instagram',
    value: '',
    type: 'string',
    category: 'social',
    label: 'إنستغرام',
    description: 'رابط حساب إنستغرام',
    icon: '📷'
  },
  {
    key: 'social_linkedin',
    value: '',
    type: 'string',
    category: 'social',
    label: 'لينكد إن',
    description: 'رابط صفحة لينكد إن',
    icon: '💼'
  },
  // Courses Settings
  {
    key: 'max_enrollments_per_user',
    value: 10,
    type: 'number',
    category: 'courses',
    label: 'حد التسجيل الأقصى',
    description: 'الحد الأقصى لعدد الدورات التي يمكن للمستخدم التسجيل فيها',
    icon: '🎓'
  },
  {
    key: 'default_currency',
    value: 'USD',
    type: 'string',
    category: 'courses',
    label: 'العملة الافتراضية',
    description: 'العملة المستخدمة لعرض أسعار الدورات (USD, SYP, EUR)',
    icon: '💵'
  },
  {
    key: 'course_completion_threshold',
    value: 100,
    type: 'number',
    category: 'courses',
    label: 'نسبة إتمام الدورة',
    description: 'نسبة التقدم المطلوبة لإتمام الدورة (0-100)',
    icon: '✅'
  },
  // Email Settings
  {
    key: 'email_from_name',
    value: 'أمار للتعليم الطبي',
    type: 'string',
    category: 'email',
    label: 'اسم المرسل',
    description: 'الاسم الذي يظهر عند إرسال البريد الإلكتروني',
    icon: '📧'
  },
  {
    key: 'email_from_address',
    value: 'noreply@amar-medical.com',
    type: 'string',
    category: 'email',
    label: 'عنوان المرسل',
    description: 'البريد الإلكتروني الذي يرسل منه النظام',
    icon: '✉️'
  },
  {
    key: 'email_enabled',
    value: true,
    type: 'boolean',
    category: 'email',
    label: 'تفعيل الإيميلات',
    description: 'تفعيل أو تعطيل إرسال البريد الإلكتروني',
    icon: '🔔'
  },
  // Security Settings
  {
    key: 'max_login_attempts',
    value: 5,
    type: 'number',
    category: 'security',
    label: 'حد محاولات تسجيل الدخول',
    description: 'عدد المحاولات المسموحة قبل حظر الحساب',
    icon: '🔒'
  },
  {
    key: 'session_timeout',
    value: 7200,
    type: 'number',
    category: 'security',
    label: 'مهلة الجلسة (بالثواني)',
    description: 'مدة صلاحية جلسة المستخدم بالثواني (7200 = ساعتان)',
    icon: '⏱️'
  },
  {
    key: 'enable_2fa',
    value: false,
    type: 'boolean',
    category: 'security',
    label: 'تفعيل المصادقة الثنائية',
    description: 'تفعيل المصادقة الثنائية للمستخدمين',
    icon: '🛡️'
  },
  // Payment Settings
  {
    key: 'payment_enabled',
    value: true,
    type: 'boolean',
    category: 'payment',
    label: 'تفعيل المدفوعات',
    description: 'تفعيل أو تعطيل نظام المدفوعات',
    icon: '💳'
  },
  {
    key: 'payment_gateway',
    value: 'stripe',
    type: 'string',
    category: 'payment',
    label: 'بوابة الدفع',
    description: 'البوابة المستخدمة للمدفوعات (stripe, paypal, etc.)',
    icon: '🏦'
  },
  {
    key: 'free_courses_enabled',
    value: true,
    type: 'boolean',
    category: 'payment',
    label: 'السماح بالدورات المجانية',
    description: 'السماح بإنشاء دورات مجانية',
    icon: '🎁'
  }
]

const categoryLabels: Record<string, { label: string; icon: string; description: string }> = {
  general: { label: 'عام', icon: '⚙️', description: 'الإعدادات العامة للمنصة' },
  contact: { label: 'معلومات الاتصال', icon: '📞', description: 'معلومات التواصل والعنوان' },
  seo: { label: 'SEO', icon: '🔍', description: 'تحسين محركات البحث' },
  social: { label: 'وسائل التواصل', icon: '📱', description: 'روابط وسائل التواصل الاجتماعي' },
  courses: { label: 'الدورات', icon: '📚', description: 'إعدادات الدورات والتسجيلات' },
  email: { label: 'البريد الإلكتروني', icon: '📧', description: 'إعدادات البريد الإلكتروني' },
  security: { label: 'الأمان', icon: '🔒', description: 'إعدادات الأمان والخصوصية' },
  payment: { label: 'المدفوعات', icon: '💳', description: 'إعدادات المدفوعات والاشتراكات' }
}

const categoryOrder = ['general', 'contact', 'seo', 'social', 'courses', 'email', 'security', 'payment']

export function SettingsClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = React.useState<Setting[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState<Record<string, boolean>>({})
  const [csrfToken, setCsrfToken] = React.useState('')
  const [newSetting, setNewSetting] = React.useState({ key: '', value: '', type: 'string' as const, category: 'general' })
  const [localValues, setLocalValues] = React.useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<string>('general')
  const [deleting, setDeleting] = React.useState<Record<string, boolean>>({})
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [batchSaving, setBatchSaving] = React.useState(false)
  const [changedSettings, setChangedSettings] = React.useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [expandedSettings, setExpandedSettings] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, csrfRes] = await Promise.all([
          fetch('/api/admin/settings', { credentials: 'include' }),
          fetch('/api/auth/csrf', { credentials: 'include' })
        ])

        if (settingsRes.ok) {
          const data = await settingsRes.json()
          const loadedSettings = data.settings || []
          setSettings(loadedSettings)
          
          const initialValues: Record<string, string> = {}
          loadedSettings.forEach((s: Setting) => {
            initialValues[s.key] = String(s.value)
          })
          defaultSettings.forEach((ds) => {
            if (!initialValues[ds.key]) {
              initialValues[ds.key] = String(ds.value)
            }
          })
          setLocalValues(initialValues)
          setChangedSettings(new Set())
        } else if (settingsRes.status === 403) {
          toast('غير مصرح لك بالوصول إلى هذه الصفحة', 'error')
          router.push('/auth/login')
        }

        if (csrfRes.ok) {
          const csrfData = await csrfRes.json()
          setCsrfToken(csrfData.csrfToken)
        }
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error)
        toast('حدث خطأ أثناء تحميل الإعدادات', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router, toast])

  // Validation functions
  const validateSetting = (key: string, value: any, type: string): string | null => {
    if (type === 'email' || key.includes('email')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(String(value))) {
        return 'البريد الإلكتروني غير صالح'
      }
    }

    if (type === 'url' || key.includes('url') || key.includes('_link') || key.includes('og_image') || key.includes('social_')) {
      if (value && value.trim() !== '') {
        try {
          new URL(String(value))
        } catch {
          return 'الرابط غير صالح. يجب أن يبدأ بـ http:// أو https://'
        }
      }
    }

    if (key === 'default_currency') {
      const validCurrencies = ['USD', 'SYP', 'EUR']
      if (!validCurrencies.includes(String(value))) {
        return 'العملة يجب أن تكون USD أو SYP أو EUR'
      }
    }

    if (key === 'course_completion_threshold') {
      const num = Number(value)
      if (isNaN(num) || num < 0 || num > 100) {
        return 'نسبة الإتمام يجب أن تكون بين 0 و 100'
      }
    }

    if (key === 'max_enrollments_per_user') {
      const num = Number(value)
      if (isNaN(num) || num < 1) {
        return 'حد التسجيل يجب أن يكون رقماً أكبر من 0'
      }
    }

    if (key === 'max_login_attempts') {
      const num = Number(value)
      if (isNaN(num) || num < 1 || num > 10) {
        return 'حد محاولات تسجيل الدخول يجب أن يكون بين 1 و 10'
      }
    }

    if (key === 'session_timeout') {
      const num = Number(value)
      if (isNaN(num) || num < 300 || num > 86400) {
        return 'مهلة الجلسة يجب أن تكون بين 300 (5 دقائق) و 86400 (24 ساعة) ثانية'
      }
    }

    if (key === 'email_from_address' || key.includes('email')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(String(value))) {
        return 'البريد الإلكتروني غير صالح'
      }
    }

    if (key === 'payment_gateway') {
      const validGateways = ['stripe', 'paypal', 'moyasar', 'tap']
      if (value && !validGateways.includes(String(value).toLowerCase())) {
        return 'البوابة المدخلة غير مدعومة (stripe, paypal, moyasar, tap)'
      }
    }

    if (type === 'number') {
      if (value !== '' && isNaN(Number(value))) {
        return 'يجب إدخال رقم صحيح'
      }
    }

    return null
  }

  const handleSave = async (setting: Setting | DefaultSetting, newValue: any) => {
    if (!csrfToken) {
      toast('رمز الحماية غير متوفر', 'warning')
      return
    }

    // Validation
    const validationError = validateSetting(setting.key, newValue, setting.type)
    if (validationError) {
      toast(validationError, 'error')
      return
    }

    const key = setting.key
    setSaving((prev) => ({ ...prev, [key]: true }))
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          key: setting.key,
          value: newValue,
          type: setting.type,
          category: setting.category
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء حفظ الإعداد')
      }

      const data = await response.json()
      setSettings((prev) => {
        const existing = prev.find((s) => s.key === key)
        if (existing) {
          return prev.map((s) => (s.key === key ? data.setting : s))
        }
        return [...prev, data.setting]
      })
      setLocalValues((prev) => ({ ...prev, [key]: String(newValue) }))
      setChangedSettings((prev) => {
        const updated = new Set(prev)
        updated.delete(key)
        return updated
      })
      toast('تم حفظ الإعداد بنجاح', 'success')
    } catch (error) {
      console.error('خطأ في حفظ الإعداد:', error)
      toast(error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ الإعداد', 'error')
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleDelete = async (settingKey: string) => {
    if (!csrfToken) {
      toast('رمز الحماية غير متوفر', 'warning')
      return
    }

    if (!confirm('هل أنت متأكد من حذف هذا الإعداد؟')) {
      return
    }

    setDeleting((prev) => ({ ...prev, [settingKey]: true }))
    try {
      const response = await fetch(`/api/admin/settings/${settingKey}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': csrfToken
        },
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء حذف الإعداد')
      }

      setSettings((prev) => prev.filter((s) => s.key !== settingKey))
      setLocalValues((prev) => {
        const updated = { ...prev }
        delete updated[settingKey]
        return updated
      })
      toast('تم حذف الإعداد بنجاح', 'success')
    } catch (error) {
      console.error('خطأ في حذف الإعداد:', error)
      toast(error instanceof Error ? error.message : 'حدث خطأ أثناء حذف الإعداد', 'error')
    } finally {
      setDeleting((prev) => ({ ...prev, [settingKey]: false }))
    }
  }

  const handleAdd = async () => {
    if (!csrfToken || !newSetting.key) {
      toast('يرجى ملء جميع الحقول المطلوبة', 'warning')
      return
    }

    // التحقق من أن المفتاح غير موجود
    if (settings.some((s) => s.key === newSetting.key) || defaultSettings.some((ds) => ds.key === newSetting.key)) {
      toast('هذا المفتاح موجود بالفعل', 'error')
      return
    }

    setSaving((prev) => ({ ...prev, new: true }))
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(newSetting)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'حدث خطأ أثناء إضافة الإعداد')
      }

      const data = await response.json()
      setSettings((prev) => [...prev, data.setting])
      setLocalValues((prev) => ({ ...prev, [data.setting.key]: String(data.setting.value) }))
      setNewSetting({ key: '', value: '', type: 'string', category: 'general' })
      setShowAddForm(false)
      toast('تم إضافة الإعداد بنجاح', 'success')
    } catch (error) {
      console.error('خطأ في إضافة الإعداد:', error)
      toast(error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة الإعداد', 'error')
    } finally {
      setSaving((prev) => ({ ...prev, new: false }))
    }
  }

  // Export settings to JSON
  const handleExport = () => {
    try {
      const allSettingsData: Record<string, any> = {}
      
      // Collect all settings (existing + defaults)
      settings.forEach((s) => {
        allSettingsData[s.key] = {
          value: s.value,
          type: s.type,
          category: s.category
        }
      })
      
      defaultSettings.forEach((ds) => {
        if (!allSettingsData[ds.key]) {
          const existing = settings.find((s) => s.key === ds.key)
          allSettingsData[ds.key] = {
            value: existing?.value ?? ds.value,
            type: ds.type,
            category: ds.category
          }
        }
      })

      const dataStr = JSON.stringify(allSettingsData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast('تم تصدير الإعدادات بنجاح', 'success')
    } catch (error) {
      console.error('خطأ في تصدير الإعدادات:', error)
      toast('حدث خطأ أثناء تصدير الإعدادات', 'error')
    }
  }

  // Import settings from JSON
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedData = JSON.parse(text)

      if (!importedData || typeof importedData !== 'object') {
        toast('ملف غير صالح', 'error')
        return
      }

      if (!confirm(`هل أنت متأكد من استيراد ${Object.keys(importedData).length} إعداد؟ سيتم استبدال القيم الحالية.`)) {
        return
      }

      setBatchSaving(true)
      const errors: string[] = []

      for (const [key, data] of Object.entries(importedData as Record<string, any>)) {
        try {
          const settingData = data as { value: any; type: string; category: string }
          const defaultSetting = defaultSettings.find((ds) => ds.key === key)
          const existingSetting = settings.find((s) => s.key === key)
          
          const setting: Setting | DefaultSetting = existingSetting || defaultSetting || {
            key,
            value: settingData.value,
            type: settingData.type as any,
            category: settingData.category,
            label: key,
            description: ''
          }
          
          await handleSave(setting, settingData.value)
        } catch (error) {
          errors.push(key)
        }
      }

      if (errors.length > 0) {
        toast(`تم استيراد الإعدادات مع بعض الأخطاء: ${errors.join(', ')}`, 'warning')
      } else {
        toast('تم استيراد الإعدادات بنجاح', 'success')
        // Reload settings
        window.location.reload()
      }
    } catch (error) {
      console.error('خطأ في استيراد الإعدادات:', error)
      toast('حدث خطأ أثناء استيراد الإعدادات. تأكد من صحة ملف JSON', 'error')
    } finally {
      setBatchSaving(false)
      // Reset file input
      event.target.value = ''
    }
  }

  // Reset settings to defaults
  const handleResetDefaults = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات للقيم الافتراضية؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }

    if (!confirm('هل أنت متأكد تماماً؟ سيتم حذف جميع الإعدادات المخصصة.')) {
      return
    }

    if (!csrfToken) {
      toast('رمز الحماية غير متوفر', 'warning')
      return
    }

    setBatchSaving(true)
    try {
      const errors: string[] = []

      // Reset all settings to defaults
      for (const defaultSetting of defaultSettings) {
        try {
          await handleSave(defaultSetting, defaultSetting.value)
        } catch (error) {
          errors.push(defaultSetting.key)
        }
      }

      // Delete custom settings
      const customSettings = settings.filter((s) => !defaultSettings.some((ds) => ds.key === s.key))
      for (const custom of customSettings) {
        try {
          await handleDelete(custom.key)
        } catch (error) {
          errors.push(custom.key)
        }
      }

      if (errors.length > 0) {
        toast(`تم إعادة التعيين مع بعض الأخطاء: ${errors.join(', ')}`, 'warning')
      } else {
        toast('تم إعادة تعيين جميع الإعدادات بنجاح', 'success')
        // Reload settings
        window.location.reload()
      }
    } catch (error) {
      console.error('خطأ في إعادة التعيين:', error)
      toast('حدث خطأ أثناء إعادة التعيين', 'error')
    } finally {
      setBatchSaving(false)
    }
  }

  // Batch save all changed settings
  const handleBatchSave = async () => {
    if (changedSettings.size === 0) {
      toast('لا توجد إعدادات للتغيير', 'info')
      return
    }

    if (!csrfToken) {
      toast('رمز الحماية غير متوفر', 'warning')
      return
    }

    setBatchSaving(true)
    try {
      const errors: string[] = []
      
      for (const key of changedSettings) {
        const setting = settings.find((s) => s.key === key) || defaultSettings.find((ds) => ds.key === key)
        if (!setting) continue

        const localValue = localValues[key]
        let parsedValue: any = localValue
        
        if (setting.type === 'number') {
          parsedValue = Number(localValue)
          if (isNaN(parsedValue)) {
            errors.push(key)
            continue
          }
        } else if (setting.type === 'boolean') {
          parsedValue = localValue === 'true'
        } else if (setting.type === 'json') {
          try {
            parsedValue = JSON.parse(localValue)
          } catch {
            errors.push(key)
            continue
          }
        }

        try {
          await handleSave(setting, parsedValue)
        } catch {
          errors.push(key)
        }
      }

      if (errors.length > 0) {
        toast(`تم حفظ ${changedSettings.size - errors.length} إعداد مع بعض الأخطاء: ${errors.join(', ')}`, 'warning')
      } else {
        toast(`تم حفظ ${changedSettings.size} إعداد بنجاح`, 'success')
        setChangedSettings(new Set())
      }
    } catch (error) {
      console.error('خطأ في الحفظ المتعدد:', error)
      toast('حدث خطأ أثناء الحفظ المتعدد', 'error')
    } finally {
      setBatchSaving(false)
    }
  }

  // Get settings for active tab
  const categorySettings = settings.filter((s) => s.category === activeTab)
  const categoryDefaults = defaultSettings.filter((s) => s.category === activeTab)
  const allCategorySettings = [
    ...categorySettings,
    ...categoryDefaults.filter((ds) => !categorySettings.some((s) => s.key === ds.key))
  ]

  // Filter by search query
  const filteredSettings = searchQuery
    ? allCategorySettings.filter((s) => {
        const query = searchQuery.toLowerCase()
        const defaultSetting = defaultSettings.find((ds) => ds.key === s.key)
        const label = defaultSetting?.label || s.key
        return label.toLowerCase().includes(query) || s.key.toLowerCase().includes(query)
      })
    : allCategorySettings

  // Get available categories
  const categories = categoryOrder.filter((cat) => {
    const hasSettings = settings.some((s) => s.category === cat)
    const hasDefaults = defaultSettings.some((ds) => ds.category === cat)
    return hasSettings || hasDefaults
  })

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-5'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className='h-12 w-full' />
          ))}
        </div>
        <Card variant='elevated' className='p-6'>
          <Skeleton className='mb-4 h-6 w-32' />
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        </Card>
      </div>
    )
  }

  const activeCategoryInfo = categoryLabels[activeTab] || { label: activeTab, icon: '📋', description: '' }

  // Category colors for visual distinction
  const categoryColors: Record<string, string> = {
    general: 'from-blue-500 to-cyan-500',
    contact: 'from-purple-500 to-pink-500',
    seo: 'from-orange-500 to-red-500',
    social: 'from-indigo-500 to-purple-500',
    courses: 'from-green-500 to-emerald-500',
    email: 'from-rose-500 to-pink-500',
    security: 'from-red-500 to-orange-500',
    payment: 'from-amber-500 to-yellow-500'
  }

  const toggleExpanded = (key: string) => {
    setExpandedSettings((prev) => {
      const updated = new Set(prev)
      if (updated.has(key)) {
        updated.delete(key)
      } else {
        updated.add(key)
      }
      return updated
    })
  }

  return (
    <div className='space-y-6'>
      {/* Modern Tabs Navigation */}
      <Card variant='bordered' className='overflow-hidden bg-gradient-to-br from-neutral-50 to-white p-2'>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => {
            const categoryInfo = categoryLabels[category]
            const isActive = activeTab === category
            const categorySettingsCount = settings.filter((s) => s.category === category).length
            const categoryDefaultsCount = defaultSettings.filter((s) => s.category === category).length
            const totalCount = categorySettingsCount + categoryDefaultsCount
            const colorGradient = categoryColors[category] || 'from-gray-500 to-gray-600'

            return (
              <button
                key={category}
                onClick={() => {
                  setActiveTab(category)
                  setSearchQuery('')
                }}
                className={cn(
                  'group relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? `bg-gradient-to-r ${colorGradient} text-white shadow-lg shadow-${category}-500/30 scale-105`
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 hover:shadow-md border border-neutral-200'
                )}
              >
                <span className='text-lg transition-transform group-hover:scale-110'>{categoryInfo.icon}</span>
                <span>{categoryInfo.label}</span>
                <Badge 
                  variant={isActive ? 'neutral' : 'neutral'} 
                  size='sm'
                  className={isActive ? 'bg-white/20 text-white border-white/30' : ''}
                >
                  {totalCount}
                </Badge>
                {isActive && (
                  <div className='absolute -bottom-1 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-white' />
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Enhanced Search and Actions Bar */}
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex-1 relative'>
            <div className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400'>
              <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            <Input
              type='text'
              placeholder='ابحث في الإعدادات...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pr-12 bg-white border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
            />
          </div>
          <div className='flex gap-2'>
            {/* View Mode Toggle */}
            <div className='flex rounded-xl border border-neutral-300 bg-white p-1'>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-all',
                  viewMode === 'grid'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50'
                )}
                title='عرض شبكي'
              >
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-all',
                  viewMode === 'list'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50'
                )}
                title='عرض قائمة'
              >
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              </button>
            </div>
            {changedSettings.size > 0 && (
              <Button 
                onClick={handleBatchSave} 
                disabled={batchSaving} 
                variant='primary'
                className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30'
              >
                {batchSaving ? (
                  <span className='flex items-center gap-2'>
                    <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    جاري الحفظ...
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    حفظ {changedSettings.size} إعداد
                  </span>
                )}
              </Button>
            )}
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              variant={showAddForm ? 'outline' : 'primary'}
              className={showAddForm ? '' : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30'}
            >
              {showAddForm ? (
                'إلغاء'
              ) : (
                <span className='flex items-center gap-2'>
                  <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  إضافة إعداد
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Bulk Actions */}
        <div className='flex flex-wrap gap-2 border-t border-neutral-200 pt-4'>
          <Button onClick={handleExport} variant='outline' size='sm' className='gap-2'>
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            تصدير الإعدادات
          </Button>
          <label className='cursor-pointer'>
            <span className='inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50' style={{ pointerEvents: batchSaving ? 'none' : 'auto' }}>
              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
              </svg>
              استيراد الإعدادات
              <input
                type='file'
                accept='.json'
                onChange={handleImport}
                className='hidden'
                disabled={batchSaving}
              />
            </span>
          </label>
          <Button onClick={handleResetDefaults} variant='outline' size='sm' className='gap-2 text-red-600 hover:bg-red-50 hover:text-red-700' disabled={batchSaving}>
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
            </svg>
            إعادة التعيين للافتراضي
          </Button>
          {changedSettings.size > 0 && (
            <Badge variant='warning' className='ml-auto'>
              {changedSettings.size} إعداد غير محفوظ
            </Badge>
          )}
        </div>
      </div>

      {/* Add New Setting Form */}
      {showAddForm && (
        <Card variant='elevated' className='border-2 border-primary/20 p-6'>
          <h2 className='mb-4 text-xl font-bold text-neutral-900'>إضافة إعداد جديد</h2>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-semibold text-neutral-700'>اسم الإعداد (key) *</label>
              <Input
                placeholder='مثال: new_feature_enabled'
                value={newSetting.key}
                onChange={(e) => setNewSetting((prev) => ({ ...prev, key: e.target.value }))}
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-semibold text-neutral-700'>القيمة *</label>
              <Input
                placeholder='القيمة'
                value={newSetting.value}
                onChange={(e) => setNewSetting((prev) => ({ ...prev, value: e.target.value }))}
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-semibold text-neutral-700'>النوع</label>
              <select
                className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                value={newSetting.type}
                onChange={(e) => setNewSetting((prev) => ({ ...prev, type: e.target.value as any }))}
              >
                <option value='string'>نص (string)</option>
                <option value='number'>رقم (number)</option>
                <option value='boolean'>نعم/لا (boolean)</option>
                <option value='json'>JSON</option>
              </select>
            </div>
            <div>
              <label className='mb-2 block text-sm font-semibold text-neutral-700'>الفئة</label>
              <select
                className='w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                value={newSetting.category}
                onChange={(e) => setNewSetting((prev) => ({ ...prev, category: e.target.value }))}
              >
                {Object.entries(categoryLabels).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.icon} {info.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='mt-4 flex gap-2'>
            <Button onClick={handleAdd} disabled={!newSetting.key || !csrfToken || saving.new} className='flex-1'>
              {saving.new ? 'جاري الإضافة...' : 'إضافة إعداد'}
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant='outline'>
              إلغاء
            </Button>
          </div>
        </Card>
      )}

      {/* Enhanced Settings Content */}
      <div className='space-y-6'>
        {/* Category Header */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${categoryColors[activeTab] || 'from-gray-500 to-gray-600'} p-6 text-white shadow-xl`}>
          <div className='relative z-10 flex items-center justify-between'>
            <div className='space-y-1'>
              <div className='flex items-center gap-3'>
                <span className='text-4xl'>{activeCategoryInfo.icon}</span>
                <h2 className='text-3xl font-bold'>{activeCategoryInfo.label}</h2>
              </div>
              {activeCategoryInfo.description && (
                <p className='text-white/90 text-sm md:text-base'>{activeCategoryInfo.description}</p>
              )}
            </div>
            <div className='flex flex-col items-end gap-2'>
              <Badge variant='neutral' className='bg-white/20 text-white border-white/30 text-base px-4 py-1.5'>
                {filteredSettings.length} إعداد
              </Badge>
              {changedSettings.size > 0 && (
                <Badge variant='warning' className='bg-yellow-400 text-yellow-900 border-yellow-300 animate-pulse'>
                  {changedSettings.size} غير محفوظ
                </Badge>
              )}
            </div>
          </div>
          <div className='absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl' />
          <div className='absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-3xl' />
        </div>

        {filteredSettings.length === 0 ? (
          <Card variant='elevated' className='p-12 text-center'>
            <div className='mx-auto mb-4 h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center'>
              <svg className='h-10 w-10 text-neutral-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-neutral-900'>لا توجد إعدادات مطابقة</h3>
            <p className='text-sm text-neutral-600'>جرب البحث بكلمات مختلفة أو انتقل إلى فئة أخرى</p>
          </Card>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredSettings.map((setting) => {
              const existingSetting = settings.find((s) => s.key === setting.key)
              const defaultSetting = defaultSettings.find((ds) => ds.key === setting.key)
              const currentValue = existingSetting?.value ?? setting.value
              const localValue = localValues[setting.key] ?? String(currentValue)
              const isDefault = !existingSetting
              const label = defaultSetting?.label || setting.key
              const description = defaultSetting?.description
              const icon = defaultSetting?.icon || '⚙️'
              const isChanged = changedSettings.has(setting.key)
              const isExpanded = expandedSettings.has(setting.key)

              return (
                <Card
                  key={setting.key}
                  variant='elevated'
                  className={cn(
                    'group relative overflow-hidden transition-all duration-300 hover:shadow-xl',
                    isChanged && 'ring-2 ring-amber-400 ring-offset-2',
                    !isExpanded && 'cursor-pointer'
                  )}
                  onClick={() => !isExpanded && toggleExpanded(setting.key)}
                >
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${categoryColors[activeTab] || 'from-gray-400 to-gray-500'}`} />
                  
                  <div className='p-5 space-y-4'>
                    {/* Header */}
                    <div className='mb-4 flex items-start justify-between gap-3'>
                      <div className='flex items-start gap-3 flex-1 min-w-0'>
                        <div className={`rounded-xl bg-gradient-to-br ${categoryColors[activeTab] || 'from-gray-400 to-gray-500'} p-2.5 text-white shadow-lg flex-shrink-0`}>
                          <span className='text-xl'>{icon}</span>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='mb-1 font-bold text-neutral-900 truncate'>{label}</h3>
                          <div className='flex flex-wrap gap-1.5'>
                            {isDefault && <Badge variant='info' size='sm'>افتراضي</Badge>}
                            <Badge variant='neutral' size='sm' className='font-mono text-xs'>
                              {setting.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {!isDefault && (
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(setting.key)
                          }}
                          disabled={deleting[setting.key]}
                          className='flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700'
                        >
                          {deleting[setting.key] ? (
                            <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                            </svg>
                          ) : (
                            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Description */}
                    {description && isExpanded && (
                      <p className='mb-4 text-sm leading-relaxed text-neutral-600'>{description}</p>
                    )}

                    {/* Code Key */}
                    {isExpanded && (
                      <div className='mb-4 rounded-lg bg-neutral-50 p-2'>
                        <code className='text-xs text-neutral-600 font-mono'>{setting.key}</code>
                      </div>
                    )}

                    {/* Value Input/Display */}
                    {isExpanded && (
                      <div className='space-y-3' onClick={(e) => e.stopPropagation()}>
                        {setting.type === 'boolean' ? (
                          <div className='flex items-center gap-4 rounded-lg bg-neutral-50 p-4'>
                            <label className='flex cursor-pointer items-center gap-3'>
                              <div className='relative'>
                                <input
                                  type='checkbox'
                                  checked={localValue === 'true'}
                                  onChange={(e) => {
                                    const newVal = e.target.checked
                                    setLocalValues((prev) => ({ ...prev, [setting.key]: String(newVal) }))
                                    handleSave(existingSetting || setting, newVal)
                                  }}
                                  className='h-6 w-6 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2'
                                  disabled={saving[setting.key]}
                                />
                              </div>
                              <div>
                                <span className={`text-base font-bold ${localValue === 'true' ? 'text-green-600' : 'text-neutral-400'}`}>
                                  {localValue === 'true' ? 'مفعل' : 'معطل'}
                                </span>
                                {saving[setting.key] && <span className='mr-2 text-xs text-neutral-500'>جاري الحفظ...</span>}
                              </div>
                            </label>
                          </div>
                        ) : (
                          <div className='space-y-2'>
                            <Input
                              type={setting.type === 'number' ? 'number' : setting.type === 'json' ? 'textarea' : 'text'}
                              value={localValue}
                              onChange={(e) => {
                                const newVal = e.target.value
                                setLocalValues((prev) => ({ ...prev, [setting.key]: newVal }))
                                const currentValue = String(existingSetting?.value ?? setting.value)
                                if (newVal !== currentValue) {
                                  setChangedSettings((prev) => new Set(prev).add(setting.key))
                                } else {
                                  setChangedSettings((prev) => {
                                    const updated = new Set(prev)
                                    updated.delete(setting.key)
                                    return updated
                                  })
                                }
                              }}
                              className={cn(
                                'w-full',
                                isChanged && 'ring-2 ring-amber-400 border-amber-400'
                              )}
                              disabled={saving[setting.key]}
                              placeholder={`أدخل ${setting.type === 'number' ? 'رقماً' : setting.type === 'json' ? 'JSON' : 'نصاً'}...`}
                            />
                            <Button
                              size='sm'
                              onClick={() => {
                                let parsedValue: any = localValue
                                if (setting.type === 'number') {
                                  parsedValue = Number(localValue)
                                  if (isNaN(parsedValue)) {
                                    toast('يرجى إدخال رقم صحيح', 'error')
                                    return
                                  }
                                } else if (setting.type === 'boolean') {
                                  parsedValue = localValue === 'true'
                                } else if (setting.type === 'json') {
                                  try {
                                    parsedValue = JSON.parse(localValue)
                                  } catch {
                                    toast('صيغة JSON غير صحيحة', 'error')
                                    return
                                  }
                                }
                                handleSave(existingSetting || setting, parsedValue).then(() => {
                                  setChangedSettings((prev) => {
                                    const updated = new Set(prev)
                                    updated.delete(setting.key)
                                    return updated
                                  })
                                })
                              }}
                              disabled={saving[setting.key] || !csrfToken || !isChanged}
                              variant={isChanged ? 'primary' : 'outline'}
                              className={cn(
                                'w-full',
                                isChanged && 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                              )}
                            >
                              {saving[setting.key] ? (
                                <span className='flex items-center justify-center gap-2'>
                                  <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                    <path
                                      className='opacity-75'
                                      fill='currentColor'
                                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    />
                                  </svg>
                                  جاري الحفظ...
                                </span>
                              ) : isChanged ? (
                                <span className='flex items-center justify-center gap-2'>
                                  <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                  </svg>
                                  حفظ التغييرات
                                </span>
                              ) : (
                                <span className='flex items-center justify-center gap-2 text-neutral-500'>
                                  <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                  </svg>
                                  محفوظ
                                </span>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Last Updated */}
                        {existingSetting && (
                          <div className='mt-4 rounded-lg bg-neutral-50 p-3'>
                            <p className='text-xs text-neutral-500'>
                              <span className='font-semibold'>آخر تحديث:</span>{' '}
                              {new Date(existingSetting.updatedAt).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expand/Collapse Button */}
                    {!isExpanded ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpanded(setting.key)
                        }}
                        className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100'
                      >
                        <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                        عرض التفاصيل
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpanded(setting.key)
                        }}
                        className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100'
                      >
                        <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
                        </svg>
                        إخفاء التفاصيل
                      </button>
                    )}
                  </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            /* List View */
            <div className='space-y-3'>
              {filteredSettings.map((setting) => {
                const existingSetting = settings.find((s) => s.key === setting.key)
                const defaultSetting = defaultSettings.find((ds) => ds.key === setting.key)
                const currentValue = existingSetting?.value ?? setting.value
                const localValue = localValues[setting.key] ?? String(currentValue)
                const isDefault = !existingSetting
                const label = defaultSetting?.label || setting.key
                const description = defaultSetting?.description
                const icon = defaultSetting?.icon || '⚙️'
                const isChanged = changedSettings.has(setting.key)

                return (
                  <Card
                    key={setting.key}
                    variant='elevated'
                    className={cn(
                      'transition-all duration-200 hover:shadow-lg',
                      isChanged && 'ring-2 ring-amber-400 ring-offset-2'
                    )}
                  >
                    <div className={`h-1 w-full bg-gradient-to-r ${categoryColors[activeTab] || 'from-gray-400 to-gray-500'} rounded-t-xl`} />
                    <div className='p-5'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex items-start gap-4 flex-1'>
                          <div className={`rounded-xl bg-gradient-to-br ${categoryColors[activeTab] || 'from-gray-400 to-gray-500'} p-3 text-white shadow-lg`}>
                            <span className='text-2xl'>{icon}</span>
                          </div>
                          <div className='flex-1 space-y-2'>
                            <div className='flex items-center gap-2'>
                              <h3 className='text-lg font-bold text-neutral-900'>{label}</h3>
                              {isDefault && <Badge variant='info' size='sm'>افتراضي</Badge>}
                              <Badge variant='neutral' size='sm' className='font-mono'>{setting.type}</Badge>
                              {isChanged && <Badge variant='warning' size='sm' className='animate-pulse'>غير محفوظ</Badge>}
                            </div>
                            {description && <p className='text-sm text-neutral-600'>{description}</p>}
                            <div className='rounded-lg bg-neutral-50 p-2'>
                              <code className='text-xs text-neutral-600 font-mono'>{setting.key}</code>
                            </div>

                            {/* Value Input */}
                            <div className='mt-4'>
                              {setting.type === 'boolean' ? (
                                <div className='flex items-center gap-4 rounded-lg bg-neutral-50 p-4'>
                                  <label className='flex cursor-pointer items-center gap-3'>
                                    <input
                                      type='checkbox'
                                      checked={localValue === 'true'}
                                      onChange={(e) => {
                                        const newVal = e.target.checked
                                        setLocalValues((prev) => ({ ...prev, [setting.key]: String(newVal) }))
                                        handleSave(existingSetting || setting, newVal)
                                      }}
                                      className='h-6 w-6 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2'
                                      disabled={saving[setting.key]}
                                    />
                                    <span className={`text-base font-bold ${localValue === 'true' ? 'text-green-600' : 'text-neutral-400'}`}>
                                      {localValue === 'true' ? 'مفعل' : 'معطل'}
                                    </span>
                                    {saving[setting.key] && <span className='text-xs text-neutral-500'>جاري الحفظ...</span>}
                                  </label>
                                </div>
                              ) : (
                                <div className='flex gap-2'>
                                  <Input
                                    type={setting.type === 'number' ? 'number' : 'text'}
                                    value={localValue}
                                    onChange={(e) => {
                                      const newVal = e.target.value
                                      setLocalValues((prev) => ({ ...prev, [setting.key]: newVal }))
                                      const currentValue = String(existingSetting?.value ?? setting.value)
                                      if (newVal !== currentValue) {
                                        setChangedSettings((prev) => new Set(prev).add(setting.key))
                                      } else {
                                        setChangedSettings((prev) => {
                                          const updated = new Set(prev)
                                          updated.delete(setting.key)
                                          return updated
                                        })
                                      }
                                    }}
                                    className={cn('flex-1', isChanged && 'ring-2 ring-amber-400')}
                                    disabled={saving[setting.key]}
                                  />
                                  <Button
                                    size='sm'
                                    onClick={() => {
                                      let parsedValue: any = localValue
                                      if (setting.type === 'number') {
                                        parsedValue = Number(localValue)
                                        if (isNaN(parsedValue)) {
                                          toast('يرجى إدخال رقم صحيح', 'error')
                                          return
                                        }
                                      } else if (setting.type === 'boolean') {
                                        parsedValue = localValue === 'true'
                                      } else if (setting.type === 'json') {
                                        try {
                                          parsedValue = JSON.parse(localValue)
                                        } catch {
                                          toast('صيغة JSON غير صحيحة', 'error')
                                          return
                                        }
                                      }
                                      handleSave(existingSetting || setting, parsedValue).then(() => {
                                        setChangedSettings((prev) => {
                                          const updated = new Set(prev)
                                          updated.delete(setting.key)
                                          return updated
                                        })
                                      })
                                    }}
                                    disabled={saving[setting.key] || !csrfToken || !isChanged}
                                    variant={isChanged ? 'primary' : 'outline'}
                                    className={isChanged ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : ''}
                                  >
                                    {saving[setting.key] ? (
                                      <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                                      </svg>
                                    ) : isChanged ? (
                                      'حفظ'
                                    ) : (
                                      '✓'
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            {existingSetting && (
                              <p className='mt-2 text-xs text-neutral-500'>
                                آخر تحديث: {new Date(existingSetting.updatedAt).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                        {!isDefault && (
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleDelete(setting.key)}
                            disabled={deleting[setting.key]}
                            className='flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700'
                          >
                            {deleting[setting.key] ? (
                              <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                              </svg>
                            ) : (
                              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
    </div>
  )
}
