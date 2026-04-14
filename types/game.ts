export type DifficultyMode = "easy" | "medium" | "hard";

export type PlayMode = "endless" | "daily";

export type GuessOutcome = "idle" | "correct" | "wrong" | "skipped";

export interface AnimeTitleSet {
  english?: string | null;
  romaji: string;
  native?: string | null;
}

export interface AnimeCatalogEntry {
  id: number;
  popularity: number;
  titles: AnimeTitleSet;
  synonyms: string[];
  coverImage: string;
  bannerImage?: string | null;
  format?: string | null;
  seasonYear?: number | null;
  meanScore?: number | null;
  siteUrl?: string | null;
}

export interface ThemeSnippet {
  themeId: number;
  source: string;
  previewSeed: number;
  songTitle?: string | null;
}

export interface RoundData {
  anime: AnimeCatalogEntry;
  snippet: ThemeSnippet;
  acceptedAnswers: string[];
  difficulty: DifficultyMode;
}

export interface RoundResult {
  outcome: Exclude<GuessOutcome, "idle">;
  guess: string;
  isCorrect: boolean;
}

export interface DailyChallengeProgress {
  date: string;
  roundIndex: number;
  score: number;
  completed: boolean;
  completedAnimeIds: number[];
}

export interface GamePreferences {
  muted: boolean;
  difficulty: DifficultyMode;
  reducedMotion: boolean;
}
