import Image from 'next/image'
import type { Header } from '@/types/slides'

export default function SlideHeader({ header }: { header: Header }) {
  return (
    <div
      className="relative px-10 py-5 flex items-center justify-between overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '2px solid #FF8200',
        fontFamily: 'Rubik, var(--font-ui)',
      }}
    >
      {/* Title + subtitle */}
      <div className="flex flex-col">
        <h1
          className="font-semibold leading-tight"
          style={{ color: '#002D72', fontFamily: 'Rubik, var(--font-ui)', fontSize: 'calc(22px * var(--slide-scale, 1))' }}
        >
          {header.title}
        </h1>
        {header.subtitle && (
          <p
            className="mt-1 leading-snug font-medium"
            style={{ color: '#FF8200', fontFamily: 'Rubik, var(--font-ui)', fontSize: 'calc(13px * var(--slide-scale, 1))' }}
          >
            {header.subtitle}
          </p>
        )}
      </div>

      {/* Logo — top right */}
      <div className="shrink-0 ml-6">
        <Image
          src="/pesLogo.png"
          alt="Logo"
          width={80}
          height={40}
          className="rounded-lg object-contain"
        />
      </div>
    </div>
  )
}
