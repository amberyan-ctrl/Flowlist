# Flowlist - Rekordbox Library Organizer and Set List Generator

A single-page app to manage a track library and build DJ set lists.

**Stack:** Next.js, TypeScript, Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features (v1)

- Mock track library with BPM, key, genre, energy, and tags
- Search and filter controls
- Build a set: add, remove, reorder (up/down buttons)
- Transition notes per track
- Export set as Markdown

All data lives in **React state** — no database yet.

## Project structure

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Home page → `DjOrganizer` |
| `components/dj/` | SPA UI components |
| `lib/mockTracks.ts` | Sample track data |
| `types/dj.ts` | Types, filters, Markdown export |

SQLite files under `lib/db.ts` are kept for a future step but are not used in this version.
