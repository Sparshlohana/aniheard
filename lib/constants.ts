import type { DifficultyMode } from "@/types/game";

export const APP_NAME = "AniHeard";
export const FIVE_SECONDS = 10;
export const DAILY_ROUNDS = 5;
export const CATALOG_CACHE_HOURS = 12;
export const SNIPPET_REPLAY_LIMIT = 3;

export const STORAGE_KEYS = {
  bestScore: "aniheard.best-score",
  bestStreak: "aniheard.best-streak",
  dailyStreak: "aniheard.daily-streak",
  lastDailyPlayedDate: "aniheard.last-daily-played-date",
  dailyProgress: "aniheard.daily-progress",
  muted: "aniheard.muted",
  difficulty: "aniheard.difficulty",
  preferences: "aniheard.preferences",
  catalogCache: "aniheard.catalog-cache",
} as const;

export const DIFFICULTY_LABELS: Record<DifficultyMode, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const DIFFICULTY_HINTS: Record<DifficultyMode, string> = {
  easy: "Mainstream giants and all-timer crowd favorites.",
  medium: "Recognizable hits that need real OP knowledge.",
  hard: "Cult classics, older gems, and niche flex picks.",
};

export const API_ENDPOINTS = {
  anilist:
    process.env.NEXT_PUBLIC_ANILIST_API_URL ?? "https://graphql.anilist.co",
  animeThemes:
    process.env.NEXT_PUBLIC_ANIME_THEMES_API_URL ??
    "https://api.animethemes.moe",
};
