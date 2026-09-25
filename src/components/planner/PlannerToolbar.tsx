import { HudFrame } from '../layout/HudFrame'

interface LegendItem {
  mark: string
  label: string
  tool: string
}

const LEGEND: LegendItem[] = [
  { mark: '🎯', label: 'Target', tool: 'Label or Mark Zone' },
  { mark: '🚪', label: 'Entry / Exit', tool: 'Label or Mark Zone' },
  { mark: '🚗', label: 'Escape route', tool: 'Escape Route tool' },
  { mark: '⚠', label: 'Danger zone', tool: 'Mark Zone or Intel' },
]

export function PlannerToolbar() {
  return (
    <HudFrame className="mb-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-bone/50">
        Blueprint legend
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LEGEND.map((item) => (
          <li key={item.label} className="text-sm">
            <span className="mr-1">{item.mark}</span>
            <span className="text-bone">{item.label}</span>
            <span className="block text-xs text-bone/50">{item.tool}</span>
          </li>
        ))}
      </ul>
    </HudFrame>
  )
}