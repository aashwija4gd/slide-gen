import type { Footer } from '@/types/slides'

export default function SlideFooter({ footer }: { footer: Footer }) {
  const fields = [
    footer.degree,
    footer.department,
    footer.subject,
    footer.unit,
    footer.classProgress,
    footer.copyright,
  ].filter(Boolean)

  return (
    <div
      className="px-10 py-2"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '2px solid #FF8200',
      }}
    >
      <div
        className="flex items-center justify-between gap-4 flex-wrap"
        style={{
          fontSize: 'calc(10px * var(--slide-scale, 1))',
          fontFamily: 'Rubik, var(--font-mono)',
          color: '#002D72',
          fontWeight: 500,
        }}
      >
        {fields.map((field, i) => (
          <span key={i}>{field}</span>
        ))}
      </div>
    </div>
  )
}
