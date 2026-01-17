import type { Config } from 'tailwindcss'
import rtl from 'tailwindcss-rtl'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['var(--font-cairo)', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: '#6366F1',
        accent: {
          purple: '#7C3AED',
          green: '#10B981',
          orange: '#F59E0B',
          red: '#EF4444',
          turquoise: '#14B8A6'
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#14B8A6'
      },
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        glass: '0 12px 32px rgba(15, 23, 42, 0.16)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.18), transparent 55%), radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.16), transparent 50%)',
        'mesh': 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(20, 184, 166, 0.08))'
      }
    }
  },
  plugins: [rtl]
}

export default config


