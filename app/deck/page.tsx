'use client'

import { useState } from 'react'
import type { Deck } from '@/types/slides'
import DeckRenderer from '@/components/deck/DeckRenderer'

export default function DeckPage() {
  const [prompt, setPrompt] = useState('')
  const [slideCount, setSlideCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [deck, setDeck] = useState<Deck | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)
    setError(null)
    setDeck(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), slideCount }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Generation failed')
        return
      }

      setDeck(data.deck)
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center px-6 py-14 gap-10"
      style={{ backgroundColor: 'var(--color-bg-page)' }}
    >
      {/* Page header */}
      <div className="w-full max-w-2xl flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--robin-500)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span
            className="text-[10px] font-medium tracking-[0.1em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--phantom-400)' }}
          >
            Slide Gen
          </span>
        </div>

        <h1
          className="text-[24px] font-semibold leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Generate a slide deck
        </h1>
        <p
          className="text-[13px] leading-relaxed mt-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Describe your topic and we'll build a complete presentation with structured content.
        </p>
      </div>

      {/* Form card */}
      <div
        className="w-full max-w-2xl rounded-2xl border"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          boxShadow: 'var(--shadow-md)',
          borderColor: 'var(--color-border-default)',
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          {/* Topic textarea */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[12px] font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Topic
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Introduction to Neural Networks for a second-year computer science course"
              rows={4}
              className="w-full rounded-xl border text-[13px] px-4 py-3 resize-none transition-colors focus:outline-none"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-ui)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-brand)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[12px] font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Slides
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={slideCount}
                onChange={(e) => setSlideCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 rounded-xl border text-[13px] px-3 py-2.5 transition-colors focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderColor: 'var(--color-border-default)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-ui)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-brand)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="ml-auto px-7 py-2.5 rounded-full text-white text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--robin-500)', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--robin-600)'
              }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--robin-500)')}
            >
              {loading ? 'Generating…' : 'Generate slides'}
            </button>
          </div>
        </form>

        {error && (
          <div
            className="mx-6 mb-6 rounded-xl border px-4 py-3 text-[13px]"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#FAAEAD',
              color: '#851E1E',
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--robin-300)', borderTopColor: 'transparent' }}
          />
          <span
            className="text-[13px]"
            style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}
          >
            Building your deck…
          </span>
        </div>
      )}

      {/* Generated deck */}
      {deck && (
        <div className="w-full max-w-5xl">
          <DeckRenderer deck={deck} />
        </div>
      )}
    </main>
  )
}
