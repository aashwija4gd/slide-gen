'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Deck } from '@/types/slides'
import SlideFrame from './SlideFrame'

export default function DeckRenderer({ deck }: { deck: Deck }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { slides } = deck

  const goNext = useCallback(() => {
    setDirection(1)
    setIndex((i) => Math.min(i + 1, slides.length - 1))
  }, [slides.length])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'Escape') {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  // Prevent body scroll when in fullscreen overlay
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  const slideContent = (
    <AnimatePresence custom={direction} mode="popLayout">
      <SlideFrame
        key={index}
        slide={slides[index]}
        direction={direction}
        onPrev={goPrev}
        onNext={goNext}
        isFullscreen={isFullscreen}
      />
    </AnimatePresence>
  )

  return (
    <>
      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: '#000' }}
        >
          {/* 16:9 slide container — fits inside viewport */}
          <div
            className="relative"
            style={{
              width: 'min(100vw, calc(100vh * 16 / 9))',
              height: 'min(100vh, calc(100vw * 9 / 16))',
            }}
          >
            {slideContent}

            {/* Exit fullscreen button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute bottom-4 right-4 z-50 flex items-center justify-center rounded-lg opacity-50 hover:opacity-100 transition-opacity"
              style={{ width: '32px', height: '32px', backgroundColor: 'rgba(0,45,114,0.2)', backdropFilter: 'blur(4px)' }}
              title="Exit fullscreen (Esc)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="10" y1="14" x2="3" y2="21" />
                <line x1="21" y1="3" x2="14" y2="10" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Normal deck view */}
      <div className="flex flex-col gap-4 w-full">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '16 / 9', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}
        >
          {!isFullscreen && slideContent}

          {/* Enter fullscreen button */}
          {!isFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute bottom-3 right-3 z-40 flex items-center justify-center rounded-lg opacity-40 hover:opacity-100 transition-opacity"
              style={{ width: '28px', height: '28px', backgroundColor: 'rgba(0,45,114,0.15)', backdropFilter: 'blur(4px)' }}
              title="Fullscreen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#002D72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          )}
        </div>

        {/* Carousel dots */}
        <div className="flex items-center justify-center gap-[6px]">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1)
                setIndex(i)
              }}
              className="rounded-full transition-all duration-200"
              style={{
                height: '6px',
                width: i === index ? '20px' : '6px',
                backgroundColor: i === index ? '#002D72' : 'var(--phantom-300)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <p
          className="text-center text-[11px]"
          style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}
        >
          {index + 1} / {slides.length} &nbsp;·&nbsp; click halves or arrow keys to navigate
        </p>
      </div>
    </>
  )
}
