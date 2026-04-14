# AniHeard

AniHeard is a frontend-only anime opening guess game built with Next.js. It plays a ten-second opening snippet, accepts fuzzy title guesses, tracks streaks, and includes a deterministic daily challenge that stays in sync for every player on the same day.

## Gameplay Preview

- Hit play and hear exactly 10 seconds from an anime opening.
- Type your guess with typo tolerance and alias support.
- Reveal the poster, title, and song after each round.
- Grind endless mode or clear the shared daily set.

## Stack

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Framer Motion
- Howler.js
- Fuse.js
- AniList GraphQL API
- AnimeThemes API
- localStorage persistence

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start development:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment Variables

```bash
NEXT_PUBLIC_ANILIST_API_URL=https://graphql.anilist.co
NEXT_PUBLIC_ANIME_THEMES_API_URL=https://api.animethemes.moe
```

## Deployment

- Push the repo to GitHub.
- Import it into Vercel.
- Add the same public environment variables in the Vercel project settings.
- Deploy without any backend setup.

## Persistence

AniHeard stores only lightweight browser data:

- best score
- best streak
- daily streak
- daily progress for the current date
- mute preference
- selected difficulty
- cached catalog metadata

## Project Structure

```text
app/
components/
hooks/
lib/
services/
types/
utils/
```

## API Credits

- [AniList](https://anilist.co)
- [AnimeThemes](https://animethemes.moe)

## Screenshots

- `docs/screenshot-home.png` placeholder
- `docs/screenshot-reveal.png` placeholder
- `docs/screenshot-daily.png` placeholder

## Future Ideas

- share card image generation
- opening/ending toggle
- genre events and themed weeks
- local stats dashboard
- PWA install prompt
