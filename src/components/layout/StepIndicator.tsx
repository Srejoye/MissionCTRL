interface StepIndicatorProps {
  current: number
  labels: string[]
}

export function StepIndicator({ current, labels }: StepIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {labels.map((label, index) => {
        const step = index + 1
        const isActive = step === current
        const isDone = step < current

        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex h-5 w-5 items-center justify-center border font-display text-[10px] transition-colors ${
                isActive
                  ? 'border-signal-pink text-signal-pink shadow-[0_0_10px_-1px_rgba(255,46,158,0.8)]'
                  : isDone
                    ? 'border-dusk-blue/70 bg-dusk-blue/10 text-dusk-blue'
                    : 'border-bone/15 text-bone/25'
              }`}
            >
              {isDone ? '✓' : step}
            </span>
            <span
              className={`font-display text-[10px] uppercase tracking-[0.25em] ${
                isActive ? 'text-signal-pink' : `hidden sm:inline ${isDone ? 'text-dusk-blue' : 'text-bone/25'}`
              }`}
            >
              {label}
            </span>
            {step < labels.length && <span className="ml-1 h-px w-4 bg-bone/15" />}
          </div>
        )
      })}
    </div>
  )
}
