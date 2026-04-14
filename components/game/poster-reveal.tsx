"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { GuessOutcome, RoundData } from "@/types/game";

interface PosterRevealProps {
  round: RoundData | null;
  status: GuessOutcome;
}

export function PosterReveal({ round, status }: PosterRevealProps) {
  const isRevealed = status !== "idle";

  return (
    <Card className="overflow-hidden border-white/12 bg-white/5">
      <CardContent className="p-0">
        <div className="relative perspective-[1600px]">
          <motion.div
            animate={{ rotateY: isRevealed ? 180 : 0 }}
            transition={{ duration: 0.9, type: "spring", bounce: 0.18 }}
            className="relative min-h-[340px] [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <div className="relative min-h-[340px] overflow-hidden">
                {round ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-48 blur-[10px]"
                      src={round.anime.coverImage}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,211,238,0.14),rgba(15,23,42,0.8))]" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(34,211,238,0.18),rgba(15,23,42,0.92))]" />
                )}
                <div className="relative flex min-h-[340px] flex-col justify-between p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="w-fit border-cyan-300/25 bg-cyan-400/10 text-cyan-100">
                      Hidden poster
                    </Badge>
                    {round?.anime.seasonYear ? (
                      <Badge className="w-fit border-white/15 bg-white/8 text-white/75">
                        {round.anime.seasonYear}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-3xl text-white">Name that OP.</h3>
                    <p className="max-w-xs text-sm text-white/65">
                      Submit a guess to flip the card and reveal the anime behind the snippet.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {round ? (
                <div className="relative min-h-[340px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${round.anime.titles.romaji} poster`}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={round.anime.coverImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge
                      className={
                        status === "correct"
                          ? "border-emerald-300/30 bg-emerald-400/12 text-emerald-100"
                          : "border-rose-300/30 bg-rose-400/12 text-rose-100"
                      }
                    >
                      {status === "correct" ? "Correct reveal" : "Answer reveal"}
                    </Badge>
                    <h3 className="mt-4 text-2xl font-semibold text-white">
                      {round.anime.titles.english ?? round.anime.titles.romaji}
                    </h3>
                    <p className="text-sm text-white/70">
                      {round.anime.titles.romaji}
                      {round.anime.seasonYear ? ` • ${round.anime.seasonYear}` : ""}
                    </p>
                    {round.snippet.songTitle ? (
                      <p className="mt-2 text-sm text-cyan-100/80">
                        Opening theme: {round.snippet.songTitle}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
