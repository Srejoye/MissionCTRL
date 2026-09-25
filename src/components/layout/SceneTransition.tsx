export function SceneTransition() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-dusk-blue/70 shadow-[0_0_12px_2px_rgba(62,198,255,0.6)] animate-[scanline-sweep_650ms_ease-out_forwards]"
    />
  )
}