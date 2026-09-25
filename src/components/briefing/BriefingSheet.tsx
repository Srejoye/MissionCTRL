import type { CrewMember } from '../../data/crew'
import type { Location } from '../../data/locations'
import type { Operation } from '../../data/operations'
import { averageSquadStats } from '../../lib/squadStats'
import {
  formatPayout,
  getEstimatedPayout,
  getObjective,
  getRiskTier,
} from '../../lib/missionBriefing'
import { HudFrame } from '../layout/HudFrame'
import { StatBar } from './StatBar'

interface BriefingSheetProps {
  mission: {
    operation: Operation
    location: Location
    crew: CrewMember[]
    blueprintDataUrl: string | null
  }
}

export function BriefingSheet({ mission }: BriefingSheetProps) {
  const { operation, location, crew, blueprintDataUrl } = mission
  const squadStats = averageSquadStats(crew)
  const riskTier = getRiskTier(squadStats.risk)
  const payout = getEstimatedPayout(operation.id, squadStats)
  const objective = getObjective(operation.id, location.name)

  const riskTone =
    riskTier === 'High'
      ? 'border-sunfade-orange text-sunfade-orange'
      : riskTier === 'Medium'
        ? 'border-dusk-blue text-dusk-blue'
        : 'border-bone/40 text-bone'

  return (
    <HudFrame className="relative overflow-hidden !p-0">
      <div
        className="relative h-32 w-full bg-cover bg-center sm:h-40"
        style={{ backgroundImage: `url(${location.imageUrl})` }}
        role="img"
        aria-label={location.name}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,7,16,0.98), rgba(10,7,16,0.55) 60%, rgba(10,7,16,0.2))',
          }}
        />
        <span className="pointer-events-none absolute -right-12 top-5 rotate-45 border-y border-sunfade-orange/60 bg-sunfade-orange/10 px-14 py-1 font-display text-[10px] uppercase tracking-[0.4em] text-sunfade-orange/80">
          Classified
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="text-xs uppercase tracking-wide text-bone/60">
            Mission Briefing
          </p>
          <h3 className="mt-1 font-display text-3xl text-bone">
            {operation.icon} {operation.name} — {location.name}
          </h3>
        </div>
      </div>

      <div className="border-t border-dashed border-bone/15 p-6">
        <div className="max-w-prose">
          <p className="text-xs uppercase tracking-wide text-bone/50">Objective</p>
          <p className="mt-1 text-bone/80">{objective}</p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs uppercase text-bone/50">Crew</dt>
            <dd className="text-bone">{crew.length}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-bone/50">Risk</dt>
            <dd className="mt-0.5">
              <span
                className={`inline-block border px-2 py-0.5 font-display text-xs uppercase ${riskTone}`}
              >
                {riskTier}
              </span>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs uppercase text-bone/50">Estimated Payout</dt>
            <dd className="font-display text-2xl text-signal-pink">
              {formatPayout(payout)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
        <p className="mb-2 text-xs uppercase tracking-wide text-bone/50">
          Crew Roster
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {crew.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-2 border border-dusk-blue/20 bg-ink/40 px-3 py-2 text-sm text-bone/80"
            >
              <span aria-hidden="true">{member.icon}</span>
              <span>
                {member.role} — {member.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatBar label="Stealth" value={squadStats.stealth} />
          <StatBar label="Firepower" value={squadStats.firepower} />
          <StatBar label="Escape" value={squadStats.escape} />
          <StatBar label="Risk" value={squadStats.risk} tone="risk" />
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs uppercase tracking-wide text-bone/50">
            Mission Blueprint
          </p>
          {blueprintDataUrl ? (
            <div className="border border-dusk-blue/30 bg-ink/40 p-1.5">
              <img
                src={blueprintDataUrl}
                alt={`Annotated plan of ${location.name}`}
                className="w-full object-cover"
              />
            </div>
          ) : (
            <p className="text-sm text-bone/50">
              No blueprint saved for this mission.
            </p>
          )}
        </div>
      </div>
    </HudFrame>
  )
}