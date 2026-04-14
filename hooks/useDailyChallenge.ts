"use client";

import { useCallback, useMemo } from "react";
import { DAILY_ROUNDS, STORAGE_KEYS } from "@/lib/constants";
import type { DailyChallengeProgress, DifficultyMode } from "@/types/game";
import { getTodayKey, isConsecutiveDay } from "@/utils/date";
import { readStorageValue, writeStorageValue } from "@/utils/storage";

const EMPTY_PROGRESS: DailyChallengeProgress = {
  date: "",
  roundIndex: 0,
  score: 0,
  completed: false,
  completedAnimeIds: [],
};

export function useDailyChallenge() {
  const today = getTodayKey();

  const getProgress = useCallback(() => {
    const stored = readStorageValue<DailyChallengeProgress>(
      STORAGE_KEYS.dailyProgress,
      EMPTY_PROGRESS,
    );

    if (stored.date !== today) {
      const resetProgress = { ...EMPTY_PROGRESS, date: today };
      writeStorageValue(STORAGE_KEYS.dailyProgress, resetProgress);
      return resetProgress;
    }

    return stored;
  }, [today]);

  const saveProgress = useCallback((progress: DailyChallengeProgress) => {
    writeStorageValue(STORAGE_KEYS.dailyProgress, progress);
  }, []);

  const completeDailyRound = useCallback((animeId: number, wasCorrect: boolean) => {
    const progress = getProgress();
    const nextProgress: DailyChallengeProgress = {
      ...progress,
      date: today,
      roundIndex: Math.min(progress.roundIndex + 1, DAILY_ROUNDS),
      score: progress.score + (wasCorrect ? 1 : 0),
      completed: progress.roundIndex + 1 >= DAILY_ROUNDS,
      completedAnimeIds: Array.from(new Set([...progress.completedAnimeIds, animeId])),
    };

    saveProgress(nextProgress);

    if (nextProgress.completed) {
      const previousDate = readStorageValue<string | null>(
        STORAGE_KEYS.lastDailyPlayedDate,
        null,
      );
      const currentStreak = readStorageValue<number>(STORAGE_KEYS.dailyStreak, 0);
      const nextStreak =
        previousDate === today
          ? currentStreak
          : isConsecutiveDay(today, previousDate)
            ? currentStreak + 1
            : 1;

      writeStorageValue(STORAGE_KEYS.dailyStreak, nextStreak);
      writeStorageValue(STORAGE_KEYS.lastDailyPlayedDate, today);
    }

    return nextProgress;
  }, [getProgress, saveProgress, today]);

  const getDailySeed = useCallback(
    (difficulty: DifficultyMode) => `${today}:${difficulty}:daily`,
    [today],
  );

  return useMemo(
    () => ({
      today,
      dailyRounds: DAILY_ROUNDS,
      getProgress,
      saveProgress,
      completeDailyRound,
      getDailySeed,
    }),
    [completeDailyRound, getDailySeed, getProgress, saveProgress, today],
  );
}
