# Dashforge Documentation

The end-user guide for the Dashforge UI Builder, built as a static
documentation site with Next.js.

## Stack

- Next.js (App Router) with static generation, every page is prerendered
- TypeScript
- Tailwind CSS v4 (theme tokens live in `app/globals.css`)
- MDX content compiled at build time via `next-mdx-remote`

## Running locally

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000 and redirects to the first chapter.

Other scripts:

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

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
public/media/        screenshots and screen recordings
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

Screenshots and videos live in `public/media/` and every URL is resolved
through `lib/media.ts`. To serve them from a CDN or object store instead, set:

```
NEXT_PUBLIC_MEDIA_BASE_URL=https://cdn.example.com/dashforge-docs
```

Content files stay unchanged, they only ever reference bare filenames.

## Search

`app/api/search/route.ts` emits a static JSON index built from the MDX
sources. The command palette (`⌘K`) fetches it lazily on first open and scores
matches across title, description, headings, and body text.
