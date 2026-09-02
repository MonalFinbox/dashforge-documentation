/**
 * All screenshot and video URLs resolve through here so the assets can move to
 * a CDN or object store (R2/S3) later by setting NEXT_PUBLIC_MEDIA_BASE_URL,
 * with no changes to content files.
 */
const MEDIA_BASE_URL = (
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '/media'
).replace(/\/$/, '')

export function mediaUrl(filename: string): string {
  if (/^https?:\/\//.test(filename)) return filename
  return `${MEDIA_BASE_URL}/${filename.replace(/^\//, '')}`
}
