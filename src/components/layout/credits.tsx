import { medicalIllustrations } from '@/content/illustrations'

export function Credits() {
  // Group illustrations by source
  const sources = medicalIllustrations.reduce((acc, illustration) => {
    const key = illustration.sourceName
    if (!acc[key]) {
      acc[key] = {
        name: illustration.sourceName,
        author: illustration.author,
        license: illustration.license,
        url: illustration.sourceUrl,
        items: []
      }
    }
    acc[key].items.push(illustration.title)
    return acc
  }, {} as Record<string, { name: string, author: string, license: string, url: string, items: string[] }>)

  return (
    <div className='border-t border-neutral-200 bg-neutral-50 py-8'>
      <div className='mx-auto max-w-6xl px-6'>
        <h3 className='mb-4 text-sm font-semibold text-neutral-900'>حقوق الرسومات التوضيحية</h3>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Object.values(sources).map((source) => (
            <div key={source.name} className='space-y-2 text-xs text-neutral-600'>
              <p className='font-medium text-neutral-800'>{source.name}</p>
              <p>بواسطة: {source.author}</p>
              <p>الترخيص: {source.license}</p>
              <a
                href={source.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:underline'
              >
                زيارة المصدر
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
