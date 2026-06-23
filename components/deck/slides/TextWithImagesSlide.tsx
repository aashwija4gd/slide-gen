import type { ResolvedImage, TextWithImagesSlide } from '@/types/slides'
import ImageStack from '../media/ImageStack'

interface Props {
  slide: TextWithImagesSlide
  onExpand: (img: ResolvedImage) => void
}

export default function TextWithImagesSlide({ slide, onExpand }: Props) {
  return (
    <div className="grid grid-cols-3 flex-1 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="col-span-2 px-10 py-8 flex flex-col justify-start">
        <h2
          className="font-semibold mb-5 leading-snug"
          style={{ color: '#002D72', fontFamily: 'Rubik, var(--font-ui)', fontSize: 'calc(20px * var(--slide-scale, 1))' }}
        >
          {slide.header.title}
        </h2>
        <ol className="space-y-5">
          {slide.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="shrink-0 font-semibold leading-relaxed"
                style={{ color: '#000000', fontFamily: 'Rubik, var(--font-ui)', fontSize: 'calc(17px * var(--slide-scale, 1))', minWidth: 'calc(28px * var(--slide-scale, 1))' }}
              >
                {i + 1}.
              </span>
              <span
                className="leading-relaxed"
                style={{ color: '#000000', fontFamily: 'Rubik, var(--font-ui)', fontWeight: 400, fontSize: 'calc(17px * var(--slide-scale, 1))' }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="col-span-1 h-full overflow-hidden">
        <ImageStack images={slide.images} onExpand={onExpand} />
      </div>
    </div>
  )
}
