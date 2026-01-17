import { sql, getFirst } from './db/neon'

type SettingValue = string | number | boolean | any

/**
 * جلب إعداد واحد من قاعدة البيانات
 */
export async function getSetting(key: string, defaultValue?: SettingValue): Promise<SettingValue> {
  try {
    const results = await sql`
      SELECT * FROM systemsettings 
      WHERE key = ${key}
      LIMIT 1
    `
    const setting = getFirst(results)

    if (!setting) {
      return defaultValue ?? ''
    }

    // تحويل القيمة حسب النوع
    switch (setting.type) {
      case 'number':
        return Number(setting.value)
      case 'boolean':
        return setting.value === 'true'
      case 'json':
        try {
          return JSON.parse(setting.value)
        } catch {
          return setting.value
        }
      default:
        return setting.value
    }
  } catch (error) {
    // في حالة فشل الاتصال بقاعدة البيانات (مثل placeholder connection string)
    // نرجع القيمة الافتراضية بدون طباعة خطأ مزعج
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isConnectionError = 
      errorMessage.includes('Error connecting to database') ||
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('placeholder') ||
      errorMessage.includes('NeonDbError') ||
      error?.constructor?.name === 'NeonDbError'
    
    if (!isConnectionError) {
      console.error(`Error getting setting ${key}:`, error)
    }
    
    return defaultValue ?? ''
  }
}

/**
 * جلب عدة إعدادات مرة واحدة
 */
export async function getSettings(keys: string[]): Promise<Record<string, SettingValue>> {
  try {
    if (keys.length === 0) {
      return {}
    }

    const settings = await sql`
      SELECT * FROM systemsettings 
      WHERE key = ANY(${keys})
    `

    const result: Record<string, SettingValue> = {}

    for (const setting of settings) {
      switch (setting.type) {
        case 'number':
          result[setting.key] = Number(setting.value)
          break
        case 'boolean':
          result[setting.key] = setting.value === 'true'
          break
        case 'json':
          try {
            result[setting.key] = JSON.parse(setting.value)
          } catch {
            result[setting.key] = setting.value
          }
          break
        default:
          result[setting.key] = setting.value
      }
    }

    return result
  } catch (error) {
    // في حالة فشل الاتصال بقاعدة البيانات (مثل placeholder connection string)
    // نرجع object فارغ بدون طباعة خطأ مزعج
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isConnectionError = 
      errorMessage.includes('Error connecting to database') ||
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('placeholder') ||
      errorMessage.includes('NeonDbError') ||
      error?.constructor?.name === 'NeonDbError'
    
    if (!isConnectionError) {
      console.error('Error getting settings:', error)
    }
    
    return {}
  }
}

/**
 * رموز العملات وأسماؤها
 */
export const CURRENCIES = {
  USD: { symbol: '$', name: 'دولار أمريكي', code: 'USD' },
  SYP: { symbol: 'ل.س', name: 'ليرة سورية', code: 'SYP' },
  EUR: { symbol: '€', name: 'يورو', code: 'EUR' }
} as const

export type CurrencyCode = keyof typeof CURRENCIES

/**
 * تنسيق السعر حسب العملة
 */
export function formatPrice(price: number, currency: CurrencyCode = 'USD'): string {
  if (price === 0) {
    return 'مجاني'
  }

  const currencyInfo = CURRENCIES[currency]
  return `${price.toLocaleString('ar-SA')} ${currencyInfo.symbol}`
}
