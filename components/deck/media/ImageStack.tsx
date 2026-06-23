'use client'

import { useState, useRef } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import type { ResolvedImage } from '@/types/slides'

interface Props {
  images: ResolvedImage[]
  onExpand: (img: ResolvedImage) => void
}

export default function ImageStack({ images, onExpand }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleClick(i: number) {
    if (timerRef.current) return
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setExpanded((prev) => (prev === i ? null : i))
    }, 220)
  }

  function handleDoubleClick(img: ResolvedImage) {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    onExpand(img)
  }

  return (
    <MotionConfig transition={{ duration: 0.3, ease: 'easeInOut' }}>
      <div className="flex flex-col h-full gap-px pointer-events-auto">
        {images.map((img, i) => {
          const isExpanded = expanded === i
          const isCollapsed = expanded !== null && !isExpanded

          return (
            <motion.div
              key={i}
              layout
              className={[
                'relative overflow-hidden cursor-zoom-in select-none',
                isExpanded ? 'flex-1' : isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'flex-1',
              ].join(' ')}
              onClick={() => handleClick(i)}
              onDoubleClick={() => handleDoubleClick(img)}
              title={isExpanded ? 'Click to collapse · Double-click to fullscreen' : 'Click to expand · Double-click to fullscreen'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              {img.attribution && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-2 py-1 truncate"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--phantom-300)',
                    backgroundColor: 'rgba(8,12,20,0.55)',
                  }}
                >
                  {img.attribution}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </MotionConfig>
  )
}
