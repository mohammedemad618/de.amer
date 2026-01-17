import Image from 'next/image'
import { medicalIllustrations } from '@/content/illustrations'
import { cn } from '@/lib/utils/cn'

type MedicalIllustrationId = (typeof medicalIllustrations)[number]['id']

type MedicalIllustrationProps = {
  id: MedicalIllustrationId
  className?: string
  priority?: boolean
  sizes?: string
}

export function MedicalIllustration({ id, className, priority = false, sizes }: MedicalIllustrationProps) {
  const illustration = medicalIllustrations.find((item) => item.id === id)

  if (!illustration) {
    return null
  }

  return (
    <div className={cn('relative', className)}>
      <Image
        src={illustration.assetPath}
        alt={illustration.title}
        fill
        sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
        className='object-contain'
        priority={priority}
      />
    </div>
  )
}


