interface StatBarProps {
  label: string
  value: number
  tone?: 'default' | 'risk'
}

export function StatBar({ label, value, tone = 'default' }: StatBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const barColor = tone === 'risk' ? 'bg-sunfade-orange' : 'bg-dusk-blue'

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-bone/60">{label}</span>
        <span className="text-bone/60">{clamped}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full bg-ink"
      >
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}