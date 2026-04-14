"use client";

import { motion } from "framer-motion";
import { LoaderCircle, Search, Send, SkipForward, Sparkles } from "lucide-react";
import { useGame } from "@/hooks/useGame";
import { DIFFICULTY_HINTS, DIFFICULTY_LABELS } from "@/lib/constants";
import { AmbientOrbs } from "@/components/game/ambient-orbs";
import { AudioSnippetPlayer } from "@/components/game/audio-snippet-player";
import { GameOverDialog } from "@/components/game/game-over-dialog";
import { PosterReveal } from "@/components/game/poster-reveal";
import { StreakMeter } from "@/components/game/streak-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DifficultyMode, PlayMode } from "@/types/game";

const MODES: Array<{ label: string; value: PlayMode }> = [
  { label: "Endless", value: "endless" },
  { label: "Daily", value: "daily" },
];

export function GameShell() {
  const game = useGame();

  const revealCopy =
    game.status === "correct"
      ? "Direct hit."
      : game.status === "wrong"
        ? "Missed it."
        : game.status === "skipped"
          ? "Skipped."
          : "Listen. Guess. Reveal.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <AmbientOrbs />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-cyan-400/15 bg-white/6">
              <CardContent className="relative p-5 sm:p-8">
                <div className="space-y-5">
                  <Badge className="border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                    Viral anime OP guessing game
                  </Badge>
                  <div className="space-y-3">
                    <h1 className="max-w-2xl font-serif text-4xl leading-none sm:text-6xl">
                      AniHeard
                    </h1>
                    <p className="max-w-2xl text-sm text-white/72 sm:text-lg">
                      Ten seconds of anime opening chaos. Type fast, flex harder, and send your
                      streak to the group chat before someone else clears the daily.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[auto_auto_1fr]">
                    <div className="inline-flex rounded-full bg-white/7 p-1">
                      {MODES.map((mode) => (
                        <button
                          key={mode.value}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            game.playMode === mode.value
                              ? "bg-cyan-400 text-slate-950"
                              : "text-white/70 hover:text-white"
                          }`}
                          onClick={() => game.switchMode(mode.value)}
                          type="button"
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>

                    <div className="md:max-w-[220px]">
                      <Select
                        onValueChange={(value) => game.setDifficulty(value as DifficultyMode)}
                        value={game.difficulty}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        {DIFFICULTY_LABELS[game.difficulty]}
                      </p>
                      <p className="mt-1 text-sm text-white/72">
                        {DIFFICULTY_HINTS[game.difficulty]}
                      </p>
                    </div>
                  </div>

                  <AudioSnippetPlayer
                    key={game.currentRound?.snippet.themeId ?? "empty-round"}
                    canReplay={game.status === "idle"}
                    muted={game.muted}
                    onToggleMute={() => game.setMuted((value) => !value)}
                    round={game.currentRound}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/6">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      {game.playMode === "daily"
                        ? `Daily ${game.dailyProgress?.roundIndex ?? 0}/${game.dailyRounds}`
                        : `Round ${game.roundNumber || 1}`}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">{revealCopy}</h2>
                  </div>
                  <Badge className="border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-100">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Submit with Enter
                  </Badge>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    game.submitGuess(game.guess);
                  }}
                >
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <Input
                      className="pl-11"
                      onChange={(event) => game.setGuess(event.target.value)}
                      placeholder="Attack on Titan, Shingeki no Kyojin, AOT..."
                      value={game.guess}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button disabled={game.status !== "idle"} type="submit">
                      <Send className="h-4 w-4" />
                      Submit
                    </Button>
                    <Button
                      disabled={game.status !== "idle"}
                      onClick={game.skipRound}
                      type="button"
                      variant="secondary"
                    >
                      <SkipForward className="h-4 w-4" />
                      Skip
                    </Button>
                    <Button
                      disabled={game.status === "idle" || game.isPending || game.dailyCompleted}
                      onClick={game.moveToNextRound}
                      type="button"
                      variant={game.status === "skipped" ? "default" : "ghost"}
                    >
                      Next round
                    </Button>
                  </div>
                </form>

                <motion.div
                  animate={game.status === "idle" ? { opacity: 0.85 } : { opacity: 1 }}
                  className={`rounded-[24px] border p-4 ${
                    game.status === "correct"
                      ? "border-emerald-300/20 bg-emerald-400/10"
                      : game.status === "wrong" || game.status === "skipped"
                        ? "border-rose-300/20 bg-rose-400/10"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  {game.isPending ? (
                    <div className="flex items-center gap-3 text-sm text-white/72">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Pulling the next opening from AniList + AnimeThemes...
                    </div>
                  ) : game.error ? (
                    <p className="text-sm text-rose-100">{game.error}</p>
                  ) : game.currentRound ? (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        Reveal state
                      </p>
                      <p className="text-sm text-white/80">
                        {game.status === "idle"
                          ? "Hit play, trust your memory, then lock the guess."
                          : `Answer: ${
                              game.currentRound.anime.titles.english ??
                              game.currentRound.anime.titles.romaji
                            } (${game.currentRound.anime.titles.romaji})`}
                      </p>
                      {game.lastResult?.guess ? (
                        <p className="text-sm text-white/60">Your guess: {game.lastResult.guess}</p>
                      ) : null}
                    </div>
                  ) : null}
                </motion.div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <PosterReveal round={game.currentRound} status={game.status} />

            <StreakMeter
              bestScore={game.bestScore}
              bestStreak={game.bestStreak}
              score={game.score}
              streak={game.streak}
            />

            <Card className="bg-white/6">
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Daily challenge</p>
                <h2 className="mt-2 text-2xl font-semibold">Same five picks. New flex every day.</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Daily streak</p>
                  <p className="mt-2 text-3xl font-semibold text-cyan-100">{game.dailyStreak}</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Today</p>
                  <p className="mt-2 text-sm text-white/75">{game.dailyProgress?.date ?? "Loading..."}</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/72">
                {game.dailyCompleted
                  ? "Daily cleared. Your streak is banked. Come back tomorrow for a fresh set."
                  : "Every player gets the same five anime each day, generated from the date and your selected difficulty."}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => game.switchMode("daily")}
                  type="button"
                  variant={game.playMode === "daily" ? "default" : "secondary"}
                >
                  Play daily
                </Button>
                <Button
                  onClick={() => game.switchMode("endless")}
                  type="button"
                  variant={game.playMode === "endless" ? "default" : "secondary"}
                >
                  Endless grind
                </Button>
              </div>
            </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <GameOverDialog
        bestScore={game.playMode === "endless" ? game.bestScore : undefined}
        ctaLabel={game.playMode === "daily" ? "Jump into endless" : "Start a fresh run"}
        description={
          game.playMode === "daily"
            ? "Daily challenge cleared. Your streak is locked in for today."
            : "This run is in the books."
        }
        onReplay={game.playMode === "daily" ? () => game.switchMode("endless") : game.restartEndless}
        open={game.playMode === "daily" && game.dailyCompleted}
        score={game.score}
        title={game.playMode === "daily" ? "Daily cleared." : "Round over."}
      />
    </div>
  );
}
