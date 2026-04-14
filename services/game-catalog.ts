import { CATALOG_CACHE_HOURS, STORAGE_KEYS } from "@/lib/constants";
import { fetchAniListCatalogPage } from "@/services/anilist";
import { fetchOpeningSnippet } from "@/services/animethemes";
import type { AnimeCatalogEntry, DifficultyMode, RoundData } from "@/types/game";
import { buildAcceptedAnswers } from "@/utils/guessing";
import { seededShuffle } from "@/utils/seeded-random";
import { readStorageValue, writeStorageValue } from "@/utils/storage";

interface CatalogCachePayload {
  fetchedAt: number;
  entries: AnimeCatalogEntry[];
}

function getDifficultyBucket(
  entries: AnimeCatalogEntry[],
  difficulty: DifficultyMode,
) {
  const sortedEntries = [...entries].sort((left, right) => right.popularity - left.popularity);
  const easyCutoff = Math.max(20, Math.floor(sortedEntries.length * 0.18));
  const mediumCutoff = Math.max(60, Math.floor(sortedEntries.length * 0.52));

  if (difficulty === "easy") {
    return sortedEntries.slice(0, easyCutoff);
  }

  if (difficulty === "medium") {
    return sortedEntries.slice(easyCutoff, mediumCutoff);
  }

  return sortedEntries.slice(mediumCutoff);
}

async function fetchCatalog() {
  const pages = await Promise.all([1, 2, 3, 4].map((page) => fetchAniListCatalogPage(page)));
  return pages.flat();
}

export async function getCatalogEntries() {
  const cached = readStorageValue<CatalogCachePayload | null>(
    STORAGE_KEYS.catalogCache,
    null,
  );

  if (
    cached &&
    Date.now() - cached.fetchedAt < CATALOG_CACHE_HOURS * 60 * 60 * 1000 &&
    cached.entries.length > 0
  ) {
    return cached.entries;
  }

  const entries = await fetchCatalog();

  writeStorageValue(STORAGE_KEYS.catalogCache, {
    fetchedAt: Date.now(),
    entries,
  } satisfies CatalogCachePayload);

  return entries;
}

export async function getRoundForDifficulty(
  difficulty: DifficultyMode,
  seedSource: string,
  excludedAnimeIds: number[] = [],
) {
  const entries = await getCatalogEntries();
  const bucket = getDifficultyBucket(entries, difficulty).filter(
    (entry) => !excludedAnimeIds.includes(entry.id),
  );
  const shuffledEntries = seededShuffle(bucket, seedSource);

  for (const entry of shuffledEntries) {
    try {
      const snippet = await fetchOpeningSnippet(entry.id);

      if (!snippet) {
        continue;
      }

      return {
        anime: entry,
        snippet,
        difficulty,
        acceptedAnswers: buildAcceptedAnswers([
          entry.titles.english ?? "",
          entry.titles.romaji,
          entry.titles.native ?? "",
          ...entry.synonyms,
        ]),
      } satisfies RoundData;
    } catch {
      continue;
    }
  }

  throw new Error("No playable anime opening could be loaded for this mode.");
}
