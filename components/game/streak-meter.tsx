import { Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface StreakMeterProps {
  score: number;
  streak: number;
  bestScore: number;
  bestStreak: number;
}

export function StreakMeter({
  score,
  streak,
  bestScore,
  bestStreak,
}: StreakMeterProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Score", value: score, icon: Trophy },
        { label: "Streak", value: streak, icon: Flame, fiery: true },
        { label: "Best Score", value: bestScore, icon: Trophy },
        { label: "Best Streak", value: bestStreak, icon: Flame },
      ].map(({ label, value, icon: Icon, fiery }) => (
        <Card key={label} className="bg-white/6">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
            </div>
            <motion.div
              animate={fiery && value > 1 ? { scale: [1, 1.12, 1], y: [0, -4, 0] } : {}}
              transition={{ duration: 0.9, repeat: fiery && value > 1 ? Infinity : 0 }}
              className={`rounded-full p-3 ${
                fiery
                  ? "bg-orange-400/18 text-orange-200 shadow-[0_0_28px_rgba(251,146,60,0.28)]"
                  : "bg-cyan-400/12 text-cyan-100"
              }`}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
