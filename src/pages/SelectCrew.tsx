import { useNavigate } from 'react-router-dom'

import { HudFrame } from '../components/layout/HudFrame'
import { PageShell } from '../components/layout/PageShell'
import { StepIndicator } from '../components/layout/StepIndicator'
import { StatBar } from '../components/briefing/StatBar'
import { CREW, type CrewMember } from '../data/crew'
import { useMission } from '../context/MissionContext'
import { averageSquadStats } from '../lib/squadStats'

const STEP_LABELS = ['Setup', 'Planner', 'Crew', 'Briefing']

export function SelectCrew() {
  const navigate = useNavigate()
  const { mission, setCrew } = useMission()

  const toggle = (member: CrewMember) => {
    const isSelected = mission.crew.some((item) => item.id === member.id)
    setCrew(
      isSelected
        ? mission.crew.filter((item) => item.id !== member.id)
        : [...mission.crew, member]
    )
  }

  const squadStats = averageSquadStats(mission.crew)

  return (
    <PageShell>
      <StepIndicator current={3} labels={STEP_LABELS} />
      <h2 className="mt-4 font-display text-2xl text-bone">Select Crew</h2>
      <p className="mt-2 text-bone/60">
        Pick who's coming with you.
        {mission.crew.length > 0 && (
          <span className="text-dusk-blue"> {mission.crew.length} selected.</span>
        )}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CREW.map((member) => {
          const isSelected = mission.crew.some((item) => item.id === member.id)
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => toggle(member)}
              className="text-left"
            >
              <HudFrame
                className={`relative h-full overflow-hidden transition-all ${
                  isSelected
                    ? 'border-signal-pink shadow-[0_0_20px_-5px_rgba(255,46,158,0.6)]'
                    : 'hover:border-dusk-blue hover:-translate-y-0.5'
                }`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    background: isSelected
                      ? 'radial-gradient(circle at 0% 0%, rgba(255,46,158,0.18), transparent 60%)'
                      : 'radial-gradient(circle at 0% 0%, rgba(62,198,255,0.1), transparent 60%)',
                  }}
                />

                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg ${
                        isSelected
                          ? 'border-signal-pink bg-signal-pink/10'
                          : 'border-dusk-blue/40 bg-dusk-blue/5'
                      }`}
                      aria-hidden="true"
                    >
                      {member.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-lg leading-tight text-dusk-blue">
                        {member.role}
                      </h3>
                      <p className="text-xs text-bone/60">{member.name}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-signal-pink text-xs text-signal-pink">
                      ✓
                    </span>
                  )}
                </div>

                <p className="relative mt-3 text-sm text-bone/70">{member.bio}</p>

                <div className="relative mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-bone/10 pt-3">
                  <StatBar label="Stealth" value={member.stats.stealth} />
                  <StatBar label="Firepower" value={member.stats.firepower} />
                  <StatBar label="Escape" value={member.stats.escape} />
                  <StatBar
                    label="Risk"
                    value={member.stats.risk}
                    tone="risk"
                  />
                </div>
              </HudFrame>
            </button>
          )
        })}
      </div>

      {mission.crew.length > 0 && (
        <HudFrame className="mt-6 border-dusk-blue/40 bg-dusk-blue/[0.04]">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-dusk-blue">
              Squad Average
            </p>
            <p className="text-lg">
              {mission.crew.map((member) => member.icon).join(' ')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBar label="Stealth" value={squadStats.stealth} />
            <StatBar label="Firepower" value={squadStats.firepower} />
            <StatBar label="Escape" value={squadStats.escape} />
            <StatBar label="Risk" value={squadStats.risk} tone="risk" />
          </div>
        </HudFrame>
      )}

      <button
        type="button"
        disabled={mission.crew.length === 0}
        onClick={() => navigate('/briefing')}
        className="mt-8 self-start border border-signal-pink px-6 py-2 font-display text-bone shadow-[0_0_20px_-6px_rgba(255,46,158,0.7)] transition-all hover:bg-signal-pink hover:text-void disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none disabled:hover:bg-transparent disabled:hover:text-bone"
      >
        Generate Briefing →
      </button>
    </PageShell>
  )
}