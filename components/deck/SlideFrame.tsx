'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ResolvedImage, Slide } from '@/types/slides'
import SlideHeader from './SlideHeader'
import SlideFooter from './SlideFooter'
import JustTextSlide from './slides/JustTextSlide'
import TextWithImagesSlide from './slides/TextWithImagesSlide'

interface SlideFrameProps {
  slide: Slide
  direction: number
  onPrev: () => void
  onNext: () => void
  isFullscreen?: boolean
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function SlideFrame({ slide, direction, onPrev, onNext, isFullscreen }: SlideFrameProps) {
  const [expandedImage, setExpandedImage] = useState<ResolvedImage | null>(null)

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: isFullscreen ? '0' : '20px',
        ['--slide-scale' as string]: isFullscreen ? '1.65' : '1',
      }}
    >
      {/* Nav click zones covering the FULL slide (header + body + footer).
          Left half = prev, right half = next. z-10 sits above static header/footer
          but below content (z-20) so images remain interactive. */}
      {!expandedImage && (
        <>
          <button
            aria-label="Previous slide"
            onClick={onPrev}
            className="absolute inset-y-0 left-0 z-10 focus:outline-none"
            style={{ width: '50%', background: 'transparent', cursor: 'w-resize' }}
          />
          <button
            aria-label="Next slide"
            onClick={onNext}
            className="absolute inset-y-0 right-0 z-10 focus:outline-none"
            style={{ width: '50%', background: 'transparent', cursor: 'e-resize' }}
          />
        </>
      )}

      <SlideHeader header={slide.header} />

      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Slide content — z-20 so it paints above nav overlay; images inside use pointer-events-auto */}
        <div className="relative z-20 pointer-events-none flex-1 flex flex-col overflow-hidden">
          {slide.type === 'just-text' && <JustTextSlide slide={slide} />}
          {slide.type === 'text-with-images' && (
            <TextWithImagesSlide slide={slide} onExpand={setExpandedImage} />
          )}
        </div>

        {/* Full-screen expanded image overlay */}
        <AnimatePresence>
          {expandedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 flex items-center justify-center cursor-zoom-out"
              style={{ backgroundColor: 'var(--robin-900)' }}
              onDoubleClick={() => setExpandedImage(null)}
              title="Double-click to close"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={expandedImage.url}
                alt={expandedImage.alt}
                className="w-full h-full object-contain"
              />
              {expandedImage.attribution && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2 text-center truncate"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--phantom-400)',
                    backgroundColor: 'rgba(8,12,20,0.7)',
                  }}
                >
                  {expandedImage.attribution}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SlideFooter footer={slide.footer} />
    </motion.div>
  )
}
