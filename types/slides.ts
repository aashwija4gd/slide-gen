import type { z } from 'zod'
import type {
  BulletSchema,
  FooterSchema,
  HeaderSchema,
} from '@/lib/slides/schemas/shared'
import type {
  ContentDeckSchema,
  ContentSlideSchema,
  DeckSchema,
  JustTextSlideSchema,
  ResolvedImageSchema,
  SlideSchema,
  TextWithImagesSlideSchema,
} from '@/lib/slides/schemas/templates'

export type Bullet = z.infer<typeof BulletSchema>
export type Header = z.infer<typeof HeaderSchema>
export type Footer = z.infer<typeof FooterSchema>

export type ResolvedImage = z.infer<typeof ResolvedImageSchema>

export type JustTextSlide = z.infer<typeof JustTextSlideSchema>
export type TextWithImagesSlide = z.infer<typeof TextWithImagesSlideSchema>
export type Slide = z.infer<typeof SlideSchema>
export type Deck = z.infer<typeof DeckSchema>

export type ContentSlide = z.infer<typeof ContentSlideSchema>
export type ContentDeck = z.infer<typeof ContentDeckSchema>
