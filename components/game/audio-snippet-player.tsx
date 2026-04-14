"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { LoaderCircle, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { FIVE_SECONDS } from "@/lib/constants";
import { clamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { RoundData } from "@/types/game";

interface AudioSnippetPlayerProps {
  muted: boolean;
  onToggleMute: () => void;
  round: RoundData | null;
  canReplay: boolean;
}

export function AudioSnippetPlayer({
  muted,
  onToggleMute,
  round,
  canReplay,
}: AudioSnippetPlayerProps) {
  const howlRef = useRef<Howl | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const mutedRef = useRef(muted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const stopPlayback = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    howlRef.current?.stop();
    setIsPlaying(false);
    setIsStarting(false);
  }, []);

  const playSnippet = useCallback(() => {
    if (!howlRef.current || !round || isPlaying || isStarting || !canReplay || !isReady) {
      return;
    }

    const duration = howlRef.current.duration() || FIVE_SECONDS;
    const maxStart = Math.max(0, duration - FIVE_SECONDS - 0.25);
    const normalizedSeed = (round.snippet.previewSeed % 1000) / 1000;
    const previewStart = clamp(maxStart * normalizedSeed, 0, maxStart);

    howlRef.current.seek(previewStart);
    setIsStarting(true);
    howlRef.current.play();
  }, [canReplay, isPlaying, isReady, isStarting, round]);

  const handlePlaybackToggle = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    playSnippet();
  }, [isPlaying, playSnippet, stopPlayback]);

  useEffect(() => {
    if (!round) {
      return;
    }

    howlRef.current = new Howl({
      src: [round.snippet.source],
      html5: false,
      preload: true,
      onload: () => setIsReady(true),
      onloaderror: () => {
        setIsReady(false);
        setIsPlaying(false);
        setIsStarting(false);
      },
      onplay: () => {
        setIsStarting(false);
        setIsPlaying(true);

        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          stopPlayback();
        }, FIVE_SECONDS * 1000);
      },
      onend: () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        setIsPlaying(false);
        setIsStarting(false);
      },
    });

    howlRef.current.mute(mutedRef.current);
    howlRef.current.load();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      howlRef.current?.stop();
      howlRef.current?.unload();
      howlRef.current = null;
    };
  }, [round, stopPlayback]);

  useEffect(() => {
    mutedRef.current = muted;

    if (!howlRef.current) {
      return;
    }

    howlRef.current.mute(muted);
  }, [muted]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/90">10-second opening snippet</p>
          <p className="text-xs text-white/55">
            One hit. No full intro. Trust your anime instincts.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleMute}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-[24px] border border-cyan-300/20 bg-cyan-400/8 p-4">
        <Button
          className="shrink-0"
          size="icon"
          onClick={handlePlaybackToggle}
          disabled={!round || !canReplay || (!isPlaying && (!isReady || isStarting))}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : isStarting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : isReady ? (
            <Play className="h-4 w-4" />
          ) : (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          )}
        </Button>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 ${
                isPlaying ? "animate-[snippetBar_linear_forwards]" : "w-0"
              }`}
              style={{
                animationDuration: `${FIVE_SECONDS}s`,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/45">
            <span>{isStarting ? "Starting playback" : isReady ? "Preview window" : "Loading snippet"}</span>
            <span>00:10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
