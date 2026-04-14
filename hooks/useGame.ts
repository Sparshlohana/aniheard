"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { getRoundForDifficulty } from "@/services/game-catalog";
import type {
  DailyChallengeProgress,
  DifficultyMode,
  GuessOutcome,
  PlayMode,
  RoundData,
  RoundResult,
} from "@/types/game";
import { isGuessCorrect } from "@/utils/guessing";
import { readStorageValue, writeStorageValue } from "@/utils/storage";
import { useDailyChallenge } from "./useDailyChallenge";
import { useLocalStorage } from "./useLocalStorage";

function getRoundSeed(mode: PlayMode, difficulty: DifficultyMode, round: number) {
  return `${mode}:${difficulty}:${round}:${Date.now()}`;
}

export function useGame() {
  const dailyChallenge = useDailyChallenge();
  const [difficulty, setDifficulty, hasHydratedDifficulty] = useLocalStorage<DifficultyMode>(
    STORAGE_KEYS.difficulty,
    "easy",
  );
  const [muted, setMuted, hasHydratedMuted] = useLocalStorage<boolean>(
    STORAGE_KEYS.muted,
    false,
  );
  const [playMode, setPlayMode] = useState<PlayMode>("endless");
  const [currentRound, setCurrentRound] = useState<RoundData | null>(null);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useLocalStorage<number>(
    STORAGE_KEYS.bestScore,
    0,
  );
  const [bestStreak, setBestStreak] = useLocalStorage<number>(
    STORAGE_KEYS.bestStreak,
    0,
  );
  const [dailyStreak, setDailyStreak] = useLocalStorage<number>(
    STORAGE_KEYS.dailyStreak,
    0,
  );
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [status, setStatus] = useState<GuessOutcome>("idle");
  const [error, setError] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(0);
  const [isPending, startTransition] = useTransition();

  const isHydrated = hasHydratedDifficulty && hasHydratedMuted;
  const dailyProgress: DailyChallengeProgress | null = isHydrated
    ? dailyChallenge.getProgress()
    : null;
  const dailyCompleted = playMode === "daily" && Boolean(dailyProgress?.completed);

  function resetRoundFeedback() {
    setGuess("");
    setLastResult(null);
    setStatus("idle");
    setError(null);
  }

  const loadRound = useCallback(
    (mode: PlayMode, nextRoundNumber: number, excludedAnimeIds: number[]) => {
    startTransition(async () => {
        resetRoundFeedback();

        try {
          const seed =
            mode === "daily"
              ? `${dailyChallenge.getDailySeed(difficulty)}:${nextRoundNumber}`
              : getRoundSeed(mode, difficulty, nextRoundNumber);
          const round = await getRoundForDifficulty(difficulty, seed, excludedAnimeIds);

          setCurrentRound(round);
          setRoundNumber(nextRoundNumber);
        } catch (loadError) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load a new anime opening right now.",
          );
        }
    });
    },
    [dailyChallenge, difficulty],
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const currentDailyProgress = dailyChallenge.getProgress();

    if (playMode === "daily" && currentDailyProgress.completed) {
      return;
    }

    const excludedAnimeIds =
      playMode === "daily" ? currentDailyProgress.completedAnimeIds : [];
    const nextRoundNumber =
      playMode === "daily" ? currentDailyProgress.roundIndex + 1 : 1;

    loadRound(playMode, nextRoundNumber, excludedAnimeIds);
  }, [dailyChallenge, difficulty, isHydrated, loadRound, playMode]);

  function moveToNextRound() {
    if (playMode === "daily") {
      const nextProgress = dailyChallenge.getProgress();

      if (nextProgress.completed) {
        return;
      }

      loadRound("daily", nextProgress.roundIndex + 1, nextProgress.completedAnimeIds);
      return;
    }

    loadRound("endless", roundNumber + 1, currentRound ? [currentRound.anime.id] : []);
  }

  function finalizeRound(nextScore: number, nextStreak: number, result: RoundResult) {
    setScore(nextScore);
    setStreak(nextStreak);
    setStatus(result.outcome);
    setLastResult(result);

    if (playMode === "endless") {
      const bestScoreValue = Math.max(nextScore, readStorageValue<number>(STORAGE_KEYS.bestScore, 0));
      const bestStreakValue = Math.max(
        nextStreak,
        readStorageValue<number>(STORAGE_KEYS.bestStreak, 0),
      );

      setBestScore(bestScoreValue);
      setBestStreak(bestStreakValue);
      writeStorageValue(STORAGE_KEYS.bestScore, bestScoreValue);
      writeStorageValue(STORAGE_KEYS.bestStreak, bestStreakValue);
    } else if (currentRound) {
      dailyChallenge.completeDailyRound(currentRound.anime.id, result.isCorrect);
      setDailyStreak(readStorageValue<number>(STORAGE_KEYS.dailyStreak, 0));
    }
  }

  function submitGuess(rawGuess: string) {
    if (!currentRound || status !== "idle") {
      return false;
    }

    const trimmedGuess = rawGuess.trim();
    const correct = isGuessCorrect(trimmedGuess, currentRound.acceptedAnswers);
    const nextScore = score + (correct ? 1 : 0);
    const nextStreak = correct ? streak + 1 : 0;

    finalizeRound(nextScore, nextStreak, {
      outcome: correct ? "correct" : "wrong",
      guess: trimmedGuess,
      isCorrect: correct,
    });

    return correct;
  }

  function skipRound() {
    if (!currentRound || status !== "idle") {
      return;
    }

    finalizeRound(score, 0, {
      outcome: "skipped",
      guess,
      isCorrect: false,
    });
  }

  function restartEndless() {
    setScore(0);
    setStreak(0);
    setPlayMode("endless");
    loadRound("endless", 1, []);
  }

  function switchMode(mode: PlayMode) {
    const nextDailyProgress = dailyChallenge.getProgress();

    setPlayMode(mode);
    setScore(mode === "daily" ? nextDailyProgress.score : 0);
    setStreak(0);
  }

  return {
    currentRound,
    difficulty,
    setDifficulty,
    guess,
    setGuess,
    score,
    streak,
    bestScore,
    bestStreak,
    muted,
    setMuted,
    playMode,
    switchMode,
    submitGuess,
    skipRound,
    moveToNextRound,
    restartEndless,
    status,
    lastResult,
    roundNumber,
    isPending,
    error,
    isHydrated,
    dailyProgress,
    dailyStreak,
    dailyRounds: dailyChallenge.dailyRounds,
    dailyCompleted,
  };
}
