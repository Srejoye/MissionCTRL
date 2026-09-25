import { useEffect, useRef, useState } from 'react'

import type { CrewMember } from '../../data/crew'
import type { Location } from '../../data/locations'
import type { Operation } from '../../data/operations'
import { formatPayout } from '../../lib/missionBriefing'
import {
  simulateMission,
  type MissionOutcome,
  type PhaseResult,
  type ScorePart,
  type Verdict,
} from '../../lib/missionSimulation'
import { HudFrame } from '../layout/HudFrame'
import { WantedBulletinEditor } from './WantedBulletinEditor'
import './mission-run.css'

interface MissionRunProps {
  operation: Operation
  location: Location
  crew: CrewMember[]
  blueprintDataUrl: string | null
  planDetail: number
  onRevisePlan: () => void
  onReturn: () => void
}

const REPORT_STEP = 5
const INTRO_MS = 1900
const PHASE_MS = 3600

const VERDICT_STYLE: Record<Verdict, { text: string; border: string; stamp: string }> = {
  clean: { text: 'text-dusk-blue', border: 'border-dusk-blue', stamp: 'Executed' },
  messy: { text: 'text-signal-pink', border: 'border-signal-pink', stamp: 'Improvised' },
  burned: { text: 'text-sunfade-orange', border: 'border-sunfade-orange', stamp: 'Compromised' },
  busted: { text: 'text-sunfade-orange', border: 'border-sunfade-orange', stamp: 'Blown' },
}

function formatPart(part: ScorePart, index: number): string {
  if (index === 0) return `${part.label} ${part.value}`
  const sign = part.value >= 0 ? '+' : '−'
  return `${part.label} ${sign}${Math.abs(part.value)}`
}

export function MissionRun({
  operation,
  location,
  crew,
  blueprintDataUrl,
  planDetail,
  onRevisePlan,
  onReturn,
}: MissionRunProps) {
  const [runId, setRunId] = useState(0)
  const [outcome, setOutcome] = useState<MissionOutcome>(() =>
    simulateMission({ operation, location, crew, planDetail })
  )
  const [step, setStep] = useState(0)
  const lastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (step >= REPORT_STEP) return
    const timer = window.setTimeout(
      () => setStep((current) => current + 1),
      step === 0 ? INTRO_MS : PHASE_MS
    )
    return () => window.clearTimeout(timer)
  }, [step])

  useEffect(() => {
    lastRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: step === REPORT_STEP ? 'start' : 'end',
    })
  }, [step])

  const runAgain = () => {
    setOutcome(simulateMission({ operation, location, crew, planDetail }))
    setRunId((current) => current + 1)
    setStep(1)
  }

  const visiblePhases = outcome.phases.slice(0, Math.min(step, outcome.phases.length))

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mission in progress"
      className="fixed inset-0 z-[70] overflow-y-auto bg-void"
    >
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(255,46,158,0.14), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(243,237,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(243,237,247,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {step === 0 ? (
        <Intro operation={operation} location={location} />
      ) : (
        <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.4em] text-dusk-blue">
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-dusk-blue ${
                    step < REPORT_STEP ? 'animate-pulse' : ''
                  }`}
                />
                {step < REPORT_STEP ? 'Live operation' : 'Operation complete'}
              </p>
              <h2 className="mt-2 font-display text-2xl text-bone">
                {operation.icon} {operation.name} — {location.name}
              </h2>
            </div>
            {step < REPORT_STEP && (
              <button
                type="button"
                onClick={() => setStep(REPORT_STEP)}
                className="shrink-0 border border-bone/20 px-3 py-1.5 font-display text-xs uppercase tracking-wide text-bone/60 transition-colors hover:border-bone/50 hover:text-bone"
              >
                Skip
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4" aria-live="polite">
            {visiblePhases.map((phase, index) => (
              <PhaseCard
                key={`${runId}-${phase.id}`}
                phase={phase}
                index={index}
                innerRef={
                  step < REPORT_STEP && index === visiblePhases.length - 1
                    ? lastRef
                    : undefined
                }
              />
            ))}

            {step === REPORT_STEP && (
              <Report
                key={`report-${runId}`}
                outcome={outcome}
                crew={crew}
                operationName={operation.name}
                locationName={location.name}
                planDetail={planDetail}
                image={blueprintDataUrl ?? location.imageUrl}
                innerRef={lastRef}
                onRunAgain={runAgain}
                onRevisePlan={onRevisePlan}
                onReturn={onReturn}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Intro({ operation, location }: { operation: Operation; location: Location }) {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px animate-[scanline-sweep_900ms_ease-out] bg-signal-pink/80 shadow-[0_0_20px_4px_rgba(255,46,158,0.6)]" />
      <div className="animate-[lock-on_450ms_ease-out]">
        <p className="flex items-center justify-center gap-2 font-display text-[10px] uppercase tracking-[0.5em] text-dusk-blue">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dusk-blue" />
          Transmission received
        </p>
        <h2 className="mt-3 font-display text-5xl font-bold leading-none text-signal-pink sm:text-6xl">
          OPERATION
          <br />
          ACCEPTED
        </h2>
      </div>
      <p className="max-w-md text-bone/70">
        {operation.icon} {operation.name} — {location.name} is a go. Move fast, stay
        quiet.
      </p>
    </div>
  )
}

function PhaseCard({
  phase,
  index,
  innerRef,
}: {
  phase: PhaseResult
  index: number
  innerRef?: React.Ref<HTMLDivElement>
}) {
  const linesEnd = 350 + phase.lines.length * 650
  const scale = 80
  const fill = Math.max(0, Math.min(100, (phase.roll / scale) * 100))
  const tick = Math.max(0, Math.min(100, (phase.target / scale) * 100))

  return (
    <div ref={innerRef} className="mr-fade-up">
      <HudFrame>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-sm text-signal-pink">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-lg uppercase tracking-wide text-bone">
              {phase.title}
            </h3>
          </div>
          <span
            className={`mr-stamp border-2 px-2 py-0.5 font-display text-xs uppercase tracking-[0.25em] ${
              phase.passed
                ? 'border-dusk-blue text-dusk-blue'
                : 'border-sunfade-orange text-sunfade-orange'
            }`}
            style={{ animationDelay: `${linesEnd}ms` }}
          >
            {phase.passed ? 'Clear' : 'Blown'}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {phase.lines.map((line, lineIndex) => (
            <p
              key={lineIndex}
              className={`mr-fade-up text-sm ${
                line.kind === 'radio' ? 'text-dusk-blue/90' : 'text-bone/80'
              }`}
              style={{ animationDelay: `${350 + lineIndex * 650}ms` }}
            >
              {line.kind === 'radio' ? '▸ ' : ''}
              {line.text}
            </p>
          ))}
        </div>

        <div className="mr-fade-up mt-4" style={{ animationDelay: `${linesEnd}ms` }}>
          <div className="relative h-1.5 w-full bg-bone/10">
            <div
              className={`h-full ${phase.passed ? 'bg-dusk-blue' : 'bg-sunfade-orange'}`}
              style={{ width: `${fill}%` }}
            />
            <span
              className="absolute -top-1 h-3.5 w-px bg-bone/70"
              style={{ left: `${tick}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-[11px] text-bone/50">
            {phase.parts.map(formatPart).join(' · ')} ={' '}
            <span className="text-bone/80">{phase.roll}</span> · need {phase.target}
          </p>
        </div>
      </HudFrame>
    </div>
  )
}

function Report({
  outcome,
  crew,
  operationName,
  locationName,
  planDetail,
  image,
  innerRef,
  onRunAgain,
  onRevisePlan,
  onReturn,
}: {
  outcome: MissionOutcome
  crew: CrewMember[]
  operationName: string
  locationName: string
  planDetail: number
  image: string
  innerRef: React.Ref<HTMLDivElement>
  onRunAgain: () => void
  onRevisePlan: () => void
  onReturn: () => void
}) {
  const style = VERDICT_STYLE[outcome.verdict]
  const [showBulletin, setShowBulletin] = useState(false)

  return (
    <div ref={innerRef} className="mr-fade-up flex scroll-mt-6 flex-col gap-4">
      <div>
        <p className="font-display text-[10px] uppercase tracking-[0.5em] text-bone/50">
          Mission report
        </p>
        <h2
          className={`mt-1 font-display text-4xl font-bold uppercase leading-none sm:text-5xl ${style.text}`}
        >
          {outcome.headline}
        </h2>
        <p className="mt-3 max-w-lg text-bone/70">{outcome.summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Payout" tone={outcome.payout > 0 ? 'text-signal-pink' : 'text-bone/50'}>
          {formatPayout(outcome.payout)}
          {outcome.planBonusPayout > 0 && (
            <span className="mt-1 block text-[10px] font-normal normal-case tracking-normal text-bone/50">
              incl. {formatPayout(outcome.planBonusPayout)} plan bonus
            </span>
          )}
        </Tile>
        <Tile label="Wanted" tone="text-bone">
          <span aria-label={`${outcome.heat} of 5 stars`} className="tracking-widest">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={i < outcome.heat ? 'text-signal-pink' : 'text-bone/20'}
              >
                ★
              </span>
            ))}
          </span>
        </Tile>
        <Tile label="Plan detail" tone="text-dusk-blue">
          {planDetail}%
          <span className="mt-1 block text-[10px] font-normal normal-case tracking-normal text-bone/50">
            from your blueprint
          </span>
        </Tile>
        <Tile label="Crew" tone="text-bone">
          {crew.length}
        </Tile>
      </div>

      <HudFrame className="!p-0">
        <div className="relative">
          <img
            src={image}
            alt="Your mission blueprint"
            className="block max-h-72 w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/20" />
          <span className="absolute left-3 top-3 font-display text-[10px] uppercase tracking-[0.35em] text-bone/70">
            Your plan
          </span>
          <span
            className={`mr-stamp absolute bottom-4 right-4 border-4 bg-void/60 px-4 py-1 font-display text-2xl font-bold uppercase tracking-[0.2em] ${style.border} ${style.text}`}
            style={{ animationDelay: '500ms' }}
          >
            {style.stamp}
          </span>
        </div>
      </HudFrame>

      <ul className="flex flex-wrap gap-2 text-xs">
        {outcome.phases.map((phase) => (
          <li
            key={phase.id}
            className={`border px-2.5 py-1 font-display uppercase tracking-wide ${
              phase.passed
                ? 'border-dusk-blue/40 text-dusk-blue'
                : 'border-sunfade-orange/50 text-sunfade-orange'
            }`}
          >
            {phase.passed ? '✓' : '✕'} {phase.title}
          </li>
        ))}
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-3 pb-8">
        <button
          type="button"
          onClick={onRunAgain}
          className="border border-signal-pink bg-signal-pink px-6 py-2 font-display text-void shadow-[0_0_25px_-5px_rgba(255,46,158,0.8)] transition-all hover:opacity-90"
        >
          Run It Back
        </button>
        <button
          type="button"
          onClick={onRevisePlan}
          className="border border-dusk-blue px-6 py-2 font-display text-bone transition-colors hover:bg-dusk-blue hover:text-void"
        >
          Revise Plan
        </button>
        <button
          type="button"
          onClick={onReturn}
          className="border border-bone/20 px-6 py-2 font-display text-bone/70 transition-colors hover:border-bone/50 hover:text-bone"
        >
          Return to Base
        </button>
        <button
          type="button"
          onClick={() => setShowBulletin(true)}
          className="border border-sunfade-orange px-6 py-2 font-display text-sunfade-orange transition-colors hover:bg-sunfade-orange hover:text-void"
        >
          Generate Wanted Bulletin
        </button>
      </div>

      {showBulletin && (
        <WantedBulletinEditor
          outcome={outcome}
          crew={crew}
          operationName={operationName}
          locationName={locationName}
          onClose={() => setShowBulletin(false)}
        />
      )}
    </div>
  )
}

function Tile({
  label,
  tone,
  children,
}: {
  label: string
  tone: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-bone/15 bg-ink/60 p-3">
      <p className="font-display text-[10px] uppercase tracking-[0.3em] text-bone/50">
        {label}
      </p>
      <p className={`mt-1 font-display text-xl ${tone}`}>{children}</p>
    </div>
  )
}