# Limited Stop · ലിമിറ്റഡ് സ്റ്റോപ്പ്

A single-screen tribute to the sound of Kerala private buses. You sit inside an old town bus, looking toward the driver, while Malayalam bus-ride songs play.

Built with Next.js (App Router), TypeScript and Tailwind CSS. Audio comes from the YouTube IFrame Player API, and the live "onboard" counter uses Supabase Realtime Presence. There are no cookies, trackers or ads, and no personal data is collected.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see "Environment variables"
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run song:add -- <url-or-id> [...]` | Add songs. Fetches title and channel from YouTube oEmbed, skips duplicates, downloads the cover to `public/covers/<id>.jpg`. The first real song replaces the placeholders. |
| `npm run songs:check` | Checks every song still resolves through oEmbed. Exits non-zero on broken or embed-blocked videos; placeholders are skipped with a warning. |
| `npm run bg:prepare -- <image> [focusX]` | Converts an illustration to `public/bg/bus-interior.webp` plus a portrait crop for phones. |
| `npm run assets:make` | Regenerates the placeholder social card (`public/opengraph.png`) and icons. |

## Configuration

Everything you are likely to change lives in [config/site.ts](config/site.ts): site name (English and Malayalam), tagline, description, Spotify and YT Music playlist URLs, the onboard label, timezone, the route ticker list and the `radioMode` flag.

Songs live in [data/songs.json](data/songs.json):

```json
{ "id": "youtube-video-id", "title": "Song title", "artist": "Channel", "duration": 0 }
```

The file ships with three `REPLACE_ME_*` placeholders. Until you add real songs, pressing play shows a message instead of playing anything.

### Tuning the artwork

The layout is lined up to the bus illustration with CSS variables in [app/globals.css](app/globals.css):

- `--bg-position-desktop`, `--bg-position-mobile`: focal point of the background
- `--title-top`, `--title-scale`: position and size of the Malayalam title

Background files are `public/bg/bus-interior.webp` and `public/bg/bus-interior-mobile.webp`. If they are missing, a warm gradient is shown.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (live counter) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (live counter) |
| `NEXT_PUBLIC_SITE_URL` | Production URL, used for metadata, sitemap and social cards |

Without the Supabase variables the counter shows `1 onboard` (just you); no number is made up.

## Supabase setup

1. Create a project at https://supabase.com.
2. Realtime is on by default. No tables are needed.
3. Copy the project URL and the anon public key (Project Settings, API) into `.env.local`.

The site joins one Realtime channel named `onboard` and tracks a random per-tab key. Nothing personal is sent.

## Keyboard

- `Space`: play or pause
- `B`: ring the bus bell
- Seek bar: arrow keys, `Home`, `End`, `PageUp`, `PageDown`

## Optional features

- **Bus bell**: a button on the right edge and the `B` key. The sound is synthesised in the browser; there is no audio file.
- **Destination ticker**: the LED-style route board under the clock. Edit `routes` in the config; leave it empty to hide it.
- **Shared radio mode**: set `radioMode: true` in the config and give every song a real `duration` in seconds. Everyone then hears the same song at the same offset, derived from the clock with no server. Skipping and seeking are disabled in this mode.

## Connections

| Connection | Purpose |
|---|---|
| YouTube IFrame API | Audio playback, loaded lazily in a hidden container |
| YouTube oEmbed and `i.ytimg.com` | Song metadata and covers, used by the scripts only |
| Supabase Realtime Presence | Live onboard count |
| Spotify and YT Music playlists | Outbound links from the config |
| Google Fonts via `next/font` | Malayalam and UI fonts, self-hosted at build time |

## Deploying to Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Add the three environment variables above in Project Settings, Environment Variables.
3. Deploy. No custom server or build settings are needed.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain, then redeploy so the social card and sitemap use it.

Before launch, replace `public/opengraph.png` (1200×675) with final artwork.
