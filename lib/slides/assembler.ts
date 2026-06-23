import type { ContentDeck, Deck, ResolvedImage } from '@/types/slides'

export function assembleDeck(
  aiOutput: ContentDeck,
  resolvedPerSlide: ResolvedImage[][]
): Deck {
  const slides = aiOutput.slides.map((slide, i) => {
    if (slide.type === 'just-text') {
      return {
        type: 'just-text' as const,
        header: slide.header,
        bullets: slide.bullets,
        footer: slide.footer,
      }
    }

    return {
      type: 'text-with-images' as const,
      header: slide.header,
      bullets: slide.bullets,
      footer: slide.footer,
      images: resolvedPerSlide[i],
    }
  })

  return { slides }
}
