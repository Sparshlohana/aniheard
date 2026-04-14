import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-white/12 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-offset-background transition focus-visible:border-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/30",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
