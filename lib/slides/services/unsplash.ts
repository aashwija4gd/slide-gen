import type { ResolvedImage } from '@/types/slides'

const PLACEHOLDER: ResolvedImage = {
  url: 'https://placehold.co/800x600/1e293b/94a3b8?text=Image',
  thumbUrl: 'https://placehold.co/400x300/1e293b/94a3b8?text=Image',
  alt: 'Placeholder image',
  attribution: '',
}

async function fetchOne(query: string): Promise<ResolvedImage> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return PLACEHOLDER

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 3600 },
  })

  if (!res.ok) return PLACEHOLDER

  const data = await res.json()
  const photo = data.results?.[0]
  if (!photo) return PLACEHOLDER

  return {
    url: photo.urls.regular,
    thumbUrl: photo.urls.thumb,
    alt: photo.description ?? photo.alt_description ?? query,
    attribution: `${photo.user.name} on Unsplash`,
  }
}

export async function resolveImages(queries: string[]): Promise<ResolvedImage[]> {
  return Promise.all(queries.map(fetchOne))
}
