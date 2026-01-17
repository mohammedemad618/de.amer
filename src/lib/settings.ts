import { prisma } from './db/prisma'

type SettingValue = string | number | boolean | any

/**
 * جلب إعداد واحد من قاعدة البيانات
 */
export async function getSetting(key: string, defaultValue?: SettingValue): Promise<SettingValue> {
  try {
    const setting = await prisma.systemSettings.findUnique({
      where: { key }
    })

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
    console.error(`Error getting setting ${key}:`, error)
    return defaultValue ?? ''
  }
}

/**
 * جلب عدة إعدادات مرة واحدة
 */
export async function getSettings(keys: string[]): Promise<Record<string, SettingValue>> {
  try {
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: keys
        }
      }
    })

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
    console.error('Error getting settings:', error)
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
