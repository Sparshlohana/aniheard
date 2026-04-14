"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameOverDialogProps {
  open: boolean;
  score: number;
  bestScore?: number;
  onReplay: () => void;
  title: string;
  description: string;
  ctaLabel: string;
}

export function GameOverDialog({
  open,
  score,
  bestScore,
  onReplay,
  title,
  description,
  ctaLabel,
}: GameOverDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
              Session summary
            </p>
            <DialogTitle className="text-3xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-sm text-white/65">
              {description} You landed <span className="font-semibold text-white">{score}</span>
              {bestScore !== undefined ? (
                <>
                  {" "}
                  and your best score is{" "}
                  <span className="font-semibold text-cyan-200">{bestScore}</span>.
                </>
              ) : (
                "."
              )}
            </DialogDescription>
          </div>
          <Button className="w-full" size="lg" onClick={onReplay}>
            {ctaLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
