export function AmbientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
      <div className="absolute right-[-12%] top-[12%] h-80 w-80 rounded-full bg-fuchsia-500/16 blur-3xl" />
      <div className="absolute bottom-[-14%] left-[18%] h-96 w-96 rounded-full bg-emerald-400/12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%),linear-gradient(140deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]" />
    </div>
  );
}
