# Dashforge Documentation

The end-user guide for the Dashforge UI Builder, built as a static
documentation site with Next.js.

## Stack

- Next.js (App Router) with static generation, every page is prerendered
- Bun as package manager and script runner
- TypeScript
- Tailwind CSS v4 (theme tokens live in `app/globals.css`)
- MDX content compiled at build time via `next-mdx-remote`

## Running locally

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

The site runs at http://localhost:3000 and redirects to the first chapter.
Screenshots and videos won't load without `.env.local` set, see
[Media hosting](#media-hosting).

Other scripts:

```bash
bun run build      # production build
bun run typecheck  # tsc --noEmit
bun run lint       # next lint
```

Bun is the package manager and script runner. Next.js itself still runs on
Node, which is the supported configuration, so do not add `--bun` to these
scripts.

## Project layout

```
app/                 routes, layouts, and the search index endpoint
  docs/[slug]/       renders one chapter from content/docs
components/
  content/           MDX element mapping, Video, Screenshot, Callout
  layout/            header, sidebar, table of contents, pager
  search/            command palette dialog
config/
  navigation.ts      sidebar order, breadcrumbs, prev/next paging
  site.ts            site name, description, canonical URL
content/docs/        one MDX file per chapter
lib/                 content loading, TOC extraction, search index, media URLs
public/media/        local copies of screenshots/recordings, gitignored, not deployed
```

## Adding a chapter

1. Create `content/docs/<slug>.mdx` with `title` and `description`
   frontmatter.
2. Add the slug to the right section in `config/navigation.ts`.

Sidebar order, breadcrumbs, prev/next links, static params, and the search
index all derive from `navigation.ts`, so there is nothing else to update.

## Content components

Available inside any MDX file without an import:

```mdx
<Screenshot src="SS-00.jpg" alt="Required alt text" caption="Optional" />

<Video src="SS-08.mp4" caption="Optional" />
<Video src="SS-15.mp4" aspectRatio={3876 / 2160} caption="Non-default ratio" />

<Callout>Neutral note</Callout>
<Callout type="tip">Recommendation</Callout>
<Callout type="warning">Something to be careful about</Callout>
```

Videos use `preload="none"` and only fetch once the reader presses play, which
keeps page loads light despite the recordings being 2-20MB each. `aspectRatio`
defaults to the 3360x2160 ratio most recordings use; pass it explicitly when a
recording differs, so the placeholder does not shift on play.

## Media hosting

Screenshots and videos are hosted in a public Supabase Storage bucket
(`dashforge-media`), not committed to the repo, `public/media/` is a
gitignored local mirror for editing content offline. Every URL in content
files is a bare filename (e.g. `SS-00.jpg`) resolved at render time through
`lib/media.ts`, which prefixes it with `NEXT_PUBLIC_MEDIA_BASE_URL`:

```
NEXT_PUBLIC_MEDIA_BASE_URL=https://<project-ref>.supabase.co/storage/v1/object/public/dashforge-media
```

Required in two places:

- **Locally**: `.env.local` (gitignored, not committed, ask a teammate for the
  value or read it from the Vercel project settings).
- **Vercel**: Project Settings → Environment Variables, same key and value,
  applied to Production and Preview. This is separate from Supabase's own
  "sync environment variables to Vercel" integration, that feature syncs
  database credentials and does not know about this variable.

To add a new screenshot or recording: drop the file in the Supabase Storage
bucket (`dashforge-media`, must stay Public), and also into local
`public/media/` so `bun run dev` can render it without hitting the network.
Reference it in MDX by filename only, same as every other asset.

## Search

`app/api/search/route.ts` emits a static JSON index built from the MDX
sources. The command palette (`⌘K`) fetches it lazily on first open and scores
matches across title, description, headings, and body text.
