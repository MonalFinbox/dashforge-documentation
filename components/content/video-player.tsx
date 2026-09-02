'use client'

import { useRef, useState } from 'react'
import { Play } from 'lucide-react'

import { mediaUrl } from '@/lib/media'

/** Matches the 3360x2160 screen recordings that make up most of the guide */
const DEFAULT_ASPECT_RATIO = 3360 / 2160

interface VideoPlayerProps {
  src: string
  caption?: string
  /** Override when a recording was captured at a different ratio */
  aspectRatio?: number
}

/**
 * Videos in this guide are screen recordings in the 2-20MB range, so nothing is
 * fetched until the reader actually starts one. The first click swaps preload
 * off "none", reveals native controls, and plays.
 */
export function VideoPlayer({
  src,
  caption,
  aspectRatio = DEFAULT_ASPECT_RATIO,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  const start = () => {
    setStarted(true)
    const video = videoRef.current
    if (!video) return

    video.preload = 'auto'
    video.play().catch(() => {
      /* autoplay blocked, native controls remain available */
    })
  }

  return (
    <figure className="my-6">
      <div
        className="relative overflow-hidden rounded-xl border border-line bg-subtle"
        style={{ aspectRatio }}
      >
        <video
          ref={videoRef}
          src={mediaUrl(src)}
          controls={started}
          preload="none"
          playsInline
          className="block size-full object-contain"
        />

        {!started && (
          <button
            type="button"
            onClick={start}
            aria-label={caption ? `Play video: ${caption}` : 'Play video'}
            className="group absolute inset-0 flex items-center justify-center bg-subtle transition-colors hover:bg-line/40"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-canvas shadow-lg shadow-ink/10 ring-1 ring-line transition-transform group-hover:scale-105">
              <Play className="ml-0.5 size-5 fill-accent text-accent" />
            </span>
          </button>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-xs text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
