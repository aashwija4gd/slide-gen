import { NextRequest, NextResponse } from 'next/server'
import { generateDeck } from '@/lib/slides/generator'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { prompt, slideCount } = body as { prompt?: unknown; slideCount?: unknown }

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'prompt must be a non-empty string' }, { status: 400 })
  }

  if (typeof slideCount !== 'number' || slideCount < 1 || !Number.isInteger(slideCount)) {
    return NextResponse.json({ error: 'slideCount must be a positive integer' }, { status: 400 })
  }

  try {
    const deck = await generateDeck(prompt.trim(), slideCount)
    return NextResponse.json({ deck })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during generation'
    console.error('[/api/generate]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
