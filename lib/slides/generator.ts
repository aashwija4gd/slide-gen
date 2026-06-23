import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { ContentDeckSchema } from './schemas/templates'
import type { ContentDeck, ContentSlide, Deck } from '@/types/slides'
import { resolveImages } from './services/unsplash'
import { assembleDeck } from './assembler'
import { DeckSchema } from './schemas/templates'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

function buildPrompt(topic: string, slideCount: number): string {
  return `You are creating a slide deck for an educational presentation.

Topic: "${topic}"
Required slide count: ${slideCount}

Rules you MUST follow exactly:
- Generate exactly ${slideCount} slides — no more, no fewer
- Each slide must have exactly 6 bullet points
- Each bullet point must be exactly 6 words — count carefully before outputting
- Alternate slide types naturally: mix "just-text" and "text-with-images" slides
- For "text-with-images" slides, provide exactly 3 imageQueries — each must be a specific, visually descriptive phrase (e.g. "scientist examining DNA strand under microscope", NOT "science")
- Header: provide a concise title and a one-sentence subtitle relevant to that slide's content
- Footer: fill all fields appropriately for the topic (degree, department, subject, unit, classProgress like "Slide 1 of ${slideCount}", copyright like "© 2025")
- Do NOT include markdown formatting in bullets — plain text only

Return valid JSON matching the schema exactly.`
}

export async function generateSlideContent(topic: string, slideCount: number): Promise<ContentDeck> {
  const { object } = await generateObject({
    model: openrouter('openai/gpt-4o-mini'),
    schema: ContentDeckSchema,
    prompt: buildPrompt(topic, slideCount),
    maxTokens: 4000,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('[generator] raw AI output:', JSON.stringify(object, null, 2))
  }

  return object
}

export async function generateDeck(topic: string, slideCount: number): Promise<Deck> {
  const aiOutput = await generateSlideContent(topic, slideCount)

  const mediaSlides = aiOutput.slides.filter(
    (s): s is Extract<ContentSlide, { type: 'text-with-images' }> => s.type === 'text-with-images'
  )

  const allQueries = mediaSlides.flatMap((s) => s.imageQueries.map((q) => q.query))
  const flatResolved = await resolveImages(allQueries)

  const resolvedPerSlide: typeof flatResolved[] = []
  let cursor = 0
  for (const slide of aiOutput.slides) {
    if (slide.type === 'text-with-images') {
      resolvedPerSlide.push(flatResolved.slice(cursor, cursor + 3))
      cursor += 3
    } else {
      resolvedPerSlide.push([])
    }
  }

  const assembled = assembleDeck(aiOutput, resolvedPerSlide)
  return DeckSchema.parse(assembled)
}
