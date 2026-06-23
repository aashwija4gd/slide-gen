import { z } from 'zod'

export const BulletSchema = z.string().min(1)

export const HeaderSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string(),
})

export const FooterSchema = z.object({
  degree: z.string(),
  department: z.string(),
  subject: z.string(),
  unit: z.string(),
  classProgress: z.string(),
  copyright: z.string(),
})
