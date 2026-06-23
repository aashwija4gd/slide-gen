import { z } from 'zod'
import { BulletSchema, FooterSchema, HeaderSchema } from './shared'

export const ResolvedImageSchema = z.object({
  url: z.string().url(),
  thumbUrl: z.string().url(),
  alt: z.string(),
  attribution: z.string(),
})

export const JustTextSlideSchema = z.object({
  type: z.literal('just-text'),
  header: HeaderSchema,
  bullets: z.array(BulletSchema).length(6),
  footer: FooterSchema,
})

export const TextWithImagesSlideSchema = z.object({
  type: z.literal('text-with-images'),
  header: HeaderSchema,
  bullets: z.array(BulletSchema).length(6),
  footer: FooterSchema,
  images: z.array(ResolvedImageSchema).length(3),
})

export const SlideSchema = z.discriminatedUnion('type', [
  JustTextSlideSchema,
  TextWithImagesSlideSchema,
])

export const DeckSchema = z.object({
  slides: z.array(SlideSchema).min(1),
})

// ── AI-time internal schemas (image queries, not resolved URLs) ────────────────

const ImageQuerySchema = z.object({
  query: z.string().min(1),
})

export const ContentJustTextSlideSchema = z.object({
  type: z.literal('just-text'),
  header: HeaderSchema,
  bullets: z.array(BulletSchema).length(6),
  footer: FooterSchema,
})

export const ContentTextWithImagesSlideSchema = z.object({
  type: z.literal('text-with-images'),
  header: HeaderSchema,
  bullets: z.array(BulletSchema).length(6),
  footer: FooterSchema,
  imageQueries: z.array(ImageQuerySchema).length(3),
})

export const ContentSlideSchema = z.discriminatedUnion('type', [
  ContentJustTextSlideSchema,
  ContentTextWithImagesSlideSchema,
])

export const ContentDeckSchema = z.object({
  slides: z.array(ContentSlideSchema).min(1),
})
