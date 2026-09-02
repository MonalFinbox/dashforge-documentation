import { mediaUrl } from '@/lib/media'

interface ScreenshotProps {
  src: string
  alt: string
  caption?: string
}

export function Screenshot({ src, alt, caption }: ScreenshotProps) {
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-xl border border-line bg-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(src)}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block w-full"
        />
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-xs text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
