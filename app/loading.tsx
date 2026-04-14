export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border-2 border-cyan-300/25 border-t-cyan-300 animate-spin" />
        <p className="text-sm uppercase tracking-[0.32em] text-white/60">Loading AniHeard</p>
      </div>
    </div>
  );
}
