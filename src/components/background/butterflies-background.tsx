'use client'

import { useEffect, useRef, useState } from 'react'

// Type definition for butterfliesBackground instance
interface ButterfliesInstance {
  destroy?: () => void
  [key: string]: unknown
}

export function ButterfliesBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<ButterfliesInstance | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Wait for component to mount and DOM to be ready
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !containerRef.current) {
      return
    }

    let mounted = true

    const initButterflies = async () => {
      try {
        // Preload the texture image before initializing
        const textureUrl = 'https://assets.codepen.io/33787/butterflies.png'
        await new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            resolve()
          }
          img.onerror = () => {
            reject(new Error(`Failed to load texture image: ${textureUrl}`))
          }
          img.src = textureUrl
        })

        // Dynamic import of the locally installed package
        // @ts-expect-error - threejs-toys doesn't have type declarations
        const toys = await import('threejs-toys')
        
        if (!mounted || !containerRef.current) {
          return
        }

        const { butterfliesBackground } = toys

        // Check WebGL support
        const canvas = document.createElement('canvas')
        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
        if (!gl) {
          throw new Error('WebGL is not supported')
        }

        // Use URL string as in original example, but ensure image is preloaded
        instanceRef.current = butterfliesBackground({
          el: containerRef.current,
          // إزالة eventsEl لتعطيل التفاعل مع حركة الماوس وجعل الخلفية ثابتة
          
          // حجم شبكة GPGPU (General-Purpose computing on Graphics Processing Units)
          // يحدد دقة محاكاة الفيزياء للفراشات - كلما زاد العدد زادت الدقة والاستهلاك
          gpgpuSize: 5,
          
          // لون الخلفية بتنسيق hexadecimal (0xffffff = أبيض)
          // يمكن تغييره إلى أي لون آخر مثل 0x000000 للأسود
          background: 0xffffff,
          
          // نوع المادة المستخدمة في عرض الفراشات
          // 'basic' = مادة بسيطة بدون إضاءة، 'standard' = مادة قياسية مع إضاءة
          material: 'basic',
          
          // معاملات المادة: transparent = شفافية، alphaTest = عتبة الشفافية (0.5 = نصف شفاف)
          // alphaTest يحدد متى يتم تجاهل البكسل بناءً على قيمته الشفافية
          materialParams: { transparent: true, alphaTest: 0.5 },
          
          // رابط الصورة المستخدمة كنسيج للفراشات
          // يجب أن تكون الصورة بصيغة sprite sheet تحتوي على عدة فراشات
          texture: textureUrl,
          
          // عدد الفراشات المراد عرضها على الشاشة
          // كلما زاد العدد زادت جمالية المشهد واستهلاك الموارد
          textureCount: 4,
          
          // مقياس الأجنحة في المحاور الثلاثة [x, y, z]
          // [1, 1, 1] = الحجم الطبيعي، يمكن تكبيرها أو تصغيرها
          wingsScale: [1, 1, 1],
          
          // عدد الأقسام الأفقية للأجنحة (يحدد مستوى التفصيل)
          // كلما زاد العدد زادت نعومة الأجنحة واستهلاك الموارد
          wingsWidthSegments: 8,
          
          // عدد الأقسام العمودية للأجنحة (يحدد مستوى التفصيل)
          // كلما زاد العدد زادت نعومة الأجنحة واستهلاك الموارد
          wingsHeightSegments: 8,
          
          // سرعة حركة الأجنحة (سرعة الرفرفة)
          // القيم المنخفضة = حركة بطيئة، القيم العالية = حركة سريعة
          wingsSpeed: 0.25,
          
          // مقياس إزاحة الأجنحة (مدى حركة الأجنحة أثناء الرفرفة)
          // القيم العالية = حركة أجنحة أوسع وأكثر وضوحاً
          wingsDisplacementScale: 1.25,
          
          // مقياس إحداثيات الضوضاء (noise) المستخدمة في الحركة العشوائية
          // يحدد مدى تأثير الضوضاء على حركة الفراشات
          noiseCoordScale: 0.001,
          
          // معامل الوقت للضوضاء (سرعة تغير الضوضاء مع الوقت)
          // يحدد مدى سرعة تغير الأنماط العشوائية في الحركة
          noiseTimeCoef: 0.0005,
          
          // شدة الضوضاء (قوة التأثير العشوائي على الحركة)
          // القيم العالية = حركة أكثر عشوائية وغير منتظمة
          noiseIntensity: 0.00025,
          
          // نصف قطر الجذب الأول (المسافة التي تبدأ فيها الفراشات بالتفاعل مع بعضها)
          // يحدد مدى قرب الفراشات من بعضها قبل أن تبدأ بالتفاعل
          attractionRadius1: 100,
          
          // نصف قطر الجذب الثاني (نطاق تأثير أقوى للتفاعل)
          // يحدد المسافة التي يكون فيها التفاعل بين الفراشات أقوى
          attractionRadius2: 150,
          
          // السرعة القصوى للفراشات (أعلى سرعة يمكن أن تصل إليها)
          // يحدد الحد الأقصى لسرعة الحركة - القيم العالية = حركة أسرع
          maxVelocity: 0.09
        })

      } catch (error) {
        console.error('Error initializing butterflies background:', error)
      }
    }

    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      initButterflies()
    }, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      mounted = false
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy()
        instanceRef.current = null
      }
    }
  }, [isMounted])

  return (
    <div
      ref={containerRef}
      className='butterflies-container'
      aria-hidden='true'
    />
  )
}
