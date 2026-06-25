# Flowlist - Rekordbox Library Organizer and Set List Generator

Flowlist helps DJs organize tracks, filter by musical attributes, build set lists, write transition notes, and export a clean set plan.
I built it as an MVP for turning a Rekordbox-style music library into a faster planning workflow for DJ sets. 

## Why I Built This
I built Flowlist to help organize the songs in my Rekordbox so I can pull together setlists on the fly, make transition notes, and expedite prepping for events like a wedding, activation, or birthday party. This app was designed for DJs at any skill level who are prepping for paid gigs or events. It was built using Codex, Cursor, and Claude to accelerate scaffolding, component iteration, and TypeScript debugging, while making product decisions around DJ workflow and set planning.

## Next Steps
Import Rekordbox files, persist libraries with SQLite, add compatibility scoring for BPM/key transitions, and generate suggested set sequences based on energy curve and genre constraints.

<img width="1370" height="920" alt="Screenshot 2026-06-25 at 3 02 06 PM" src="https://github.com/user-attachments/assets/822ec873-8d0a-44ab-8da4-96f57009abf4" />


## Current Status

Current status: All data lives in **React state** — no database yet.


**Stack:** Next.js, TypeScript, Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features (v1)

-     Import Rekordbox XML/CSV
- Persist saved sets
- Save multiple playlists
- Suggest compatible transitions by BPM/key/energy
- Export to Markdown/CSV
- Add AI-generated transition notes or set-flow suggestions

All data lives in **React state** — no database yet.

## Roadmap - P1/P2
- Mock track library with BPM, key, genre, energy, and tags
- Search and filter controls
- Build a set: add, remove, reorder (up/down buttons)
- Transition notes per track
- Export set as Markdown


## Project structure

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Home page → `DjOrganizer` |
| `components/dj/` | SPA UI components |
| `lib/mockTracks.ts` | Sample track data |
| `types/dj.ts` | Types, filters, Markdown export |

SQLite files under `lib/db.ts` are kept for a future step but are not used in this version.
