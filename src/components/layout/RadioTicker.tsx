import { useMemo } from 'react'

import { useMission } from '../../context/MissionContext'
import { RADIO_LINES, type TickerLine } from '../../data/radioChatter'

interface RadioTickerProps {
  className?: string
}

const MIN_POOL_SIZE = 6

function buildPool(locationId: string | undefined): TickerLine[] {
  if (!locationId) return RADIO_LINES

  const matching = RADIO_LINES.filter((line) => line.locationId === locationId)
  const ambient = RADIO_LINES.filter((line) => !line.locationId)
  const pool = [...matching, ...ambient]

  return pool.length >= MIN_POOL_SIZE ? pool : RADIO_LINES
}

export function RadioTicker({ className = '' }: RadioTickerProps) {
  const { mission } = useMission()
  const locationId = mission.location?.id

  const pool = useMemo(() => buildPool(locationId), [locationId])

  const lines = useMemo(() => {
    const offset = Math.floor(Math.random() * pool.length)
    return [...pool.slice(offset), ...pool.slice(0, offset)]
  }, [pool])

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden border-y border-dusk-blue/20 bg-ink/40 ${className}`}
    >
      <div
        key={locationId ?? 'all'}
        className="flex w-max animate-[ticker-scroll_150s_linear_infinite] gap-16 whitespace-nowrap py-1.5 hover:[animation-play-state:paused]"
      >
        {[...lines, ...lines].map((line, index) => (
          <span
            key={index}
            className="flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.2em] text-bone/50"
          >
            <span className="text-dusk-blue">{line.source}</span>
            <span className="text-bone/30">—</span>
            {line.text}
          </span>
        ))}
      </div>
    </div>
  )
}
