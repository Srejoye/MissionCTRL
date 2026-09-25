import { useNavigate } from 'react-router-dom'

import { HudFrame } from '../components/layout/HudFrame'
import { RadioTicker } from '../components/layout/RadioTicker'
import { CREW } from '../data/crew'
import { LOCATIONS } from '../data/locations'
import { OPERATIONS } from '../data/operations'

function WindowLabel({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.35em] text-dusk-blue/70">
      <span className="h-1 w-1 rounded-full bg-dusk-blue" />
      {children}
    </p>
  )
}

function CheckItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 text-signal-pink">✓</span>
      <p className="text-sm leading-relaxed text-bone/70">
        <span className="font-display text-bone">{title}. </span>
        {body}
      </p>
    </li>
  )
}

interface FieldNoteProps {
  icon: string
  who: string
  what: string
  time: string
  className?: string
}

function FieldNote({ icon, who, what, time, className = '' }: FieldNoteProps) {
  return (
    <div
      className={`hidden w-56 items-start gap-3 border border-dusk-blue/20 bg-ink/90 p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:flex ${className}`}
    >
      <span className="text-lg leading-none">{icon}</span>
      <div className="min-w-0">
        <p className="font-display text-[11px] text-bone">{who}</p>
        <p className="truncate text-[11px] text-bone/50">{what}</p>
      </div>
      <span className="ml-auto shrink-0 font-display text-[9px] uppercase tracking-wider text-dusk-blue/60">
        {time}
      </span>
    </div>
  )
}

export function Landing() {
  const navigate = useNavigate()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-void text-bone">
      <RadioTicker />

      {/* NAV */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-display text-sm tracking-[0.2em] text-bone">
          MISSION<span className="text-signal-pink">//</span>CTRL
        </span>
        <nav className="hidden items-center gap-6 font-display text-[11px] uppercase tracking-[0.25em] text-bone/60 sm:flex">
          <button onClick={() => scrollTo('how')} className="transition-colors hover:text-bone">
            How it works
          </button>
          <button onClick={() => scrollTo('crew')} className="transition-colors hover:text-bone">
            Crew
          </button>
          <button onClick={() => scrollTo('plan')} className="transition-colors hover:text-bone">
            The Plan
          </button>
        </nav>
        <button
          type="button"
          onClick={() => navigate('/operation')}
          className="border border-signal-pink/60 px-4 py-1.5 font-display text-[11px] uppercase tracking-[0.2em] text-signal-pink transition-colors hover:bg-signal-pink hover:text-void"
        >
          Launch Planner
        </button>
      </header>

      {/* HERO — app-window mockup */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-32 sm:pt-10">
        {/* floating field notes, peeking off the window's edges */}
        <FieldNote
          icon="🏁"
          who="Redline"
          what="escape route locked in"
          time="0:42"
          className="absolute -left-2 top-6 z-10 -rotate-2 sm:-left-8"
        />
        <FieldNote
          icon="💻"
          who="Theo"
          what="cameras looped, feed's dead"
          time="0:58"
          className="absolute -right-2 top-24 z-10 rotate-1 sm:-right-10"
        />
        <FieldNote
          icon="🎯"
          who="Blueprint"
          what="detail score: 82 / plan locked"
          time="1:10"
          className="absolute -left-4 bottom-16 z-10 rotate-1 sm:-left-12"
        />
        <FieldNote
          icon="💰"
          who="Verdict"
          what="Clean job — payout $128,400"
          time="2:59"
          className="absolute -right-4 bottom-4 z-10 -rotate-1 sm:-right-14"
        />

        {/* the window chrome */}
        <div className="relative overflow-hidden border border-dusk-blue/25 bg-ink/70 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 50% -10%, rgba(232,130,63,0.14), transparent 60%)',
            }}
          />

          {/* title bar */}
          <div className="relative flex items-center gap-3 border-b border-dusk-blue/15 bg-void/60 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-signal-pink/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-sunfade-orange/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-dusk-blue/70" />
            <p className="ml-2 font-display text-[10px] uppercase tracking-[0.3em] text-bone/40">
              missionctrl — welcome.app
            </p>
            <p className="ml-auto hidden font-display text-[10px] uppercase tracking-[0.25em] text-bone/25 sm:block">
              Channel Secure
            </p>
          </div>

          {/* window content */}
          <div className="relative flex flex-col items-center gap-6 px-4 py-10 text-center sm:px-10 sm:py-14">
            <p className="flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.5em] text-dusk-blue/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-dusk-blue" />
              Live Feed Online
            </p>

            <h1 className="max-w-5xl text-[clamp(2.2rem,8vw,4.25rem)] font-bold leading-[1.05] font-display tracking-tight text-bone">
              Plan the job. <span className="text-signal-pink">Draw</span> the escape. Watch it play out.
            </h1>

            <p className="max-w-3xl text-balance text-bone/60">
              Pick an operation, scout a Vice-coast location, then mark up the real
              surveillance photo as your actual blueprint. What you draw decides
              how the job goes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/operation')}
                className="group relative border border-signal-pink px-8 py-3 font-display text-base text-signal-pink shadow-[0_0_25px_-5px_rgba(232,130,63,0.6)] transition-all hover:bg-signal-pink hover:text-void hover:shadow-[0_0_35px_-3px_rgba(232,130,63,0.9)]"
              >
                ▸ Build a Mission
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button
                type="button"
                onClick={() => scrollTo('how')}
                className="font-display text-sm text-bone/60 underline-offset-4 transition-colors hover:text-bone hover:underline"
              >
                See how it works
              </button>
            </div>

            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-bone/30">
              Heist · Getaway · Extraction · Delivery · Sabotage · Infiltration
            </p>
          </div>
        </div>
      </section>

      {/* BRIEF */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <HudFrame className="text-center">
          <WindowLabel>the_job.brief</WindowLabel>
          <p className="mt-4 text-balance text-lg leading-relaxed text-bone/80">
            Your blueprint isn&apos;t decorative — it&apos;s pixel-diffed
            against the real location photo to score how detailed the plan
            actually was, and that score feeds straight into the payout and
            the simulation.
          </p>
        </HudFrame>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-10 text-center">
          <WindowLabel>how_it_works.txt</WindowLabel>
          <h2 className="mt-3 text-3xl font-bold text-bone sm:text-4xl">
            Five steps. <span className="text-signal-pink">One job.</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <HudFrame>
            <WindowLabel>operation.sel</WindowLabel>
            <h3 className="mt-3 font-display text-lg text-bone">Choose an Operation</h3>
            <ul className="mt-4 space-y-3">
              <CheckItem
                title="Six job types"
                body={`${OPERATIONS.map((o) => o.name).join(', ')} — each with its own tagline and payout tier.`}
              />
            </ul>
          </HudFrame>

          <HudFrame>
            <WindowLabel>location.scout</WindowLabel>
            <h3 className="mt-3 font-display text-lg text-bone">Scout a Location</h3>
            <ul className="mt-4 space-y-3">
              <CheckItem
                title="Seven Vice-coast targets"
                body={`${LOCATIONS.slice(0, 4)
                  .map((l) => l.name)
                  .join(', ')} and more — real photos become the planning canvas.`}
              />
            </ul>
          </HudFrame>

          <HudFrame>
            <WindowLabel>blueprint.plan</WindowLabel>
            <h3 className="mt-3 font-display text-lg text-bone">Plan the Job</h3>
            <ul className="mt-4 space-y-3">
              <CheckItem
                title="Draw, don't describe"
                body="Draw becomes Escape Route, Shapes becomes Mark Zone, Stickers becomes Intel — a real editor, retheed for the job."
              />
            </ul>
          </HudFrame>

          <HudFrame>
            <WindowLabel>crew.roster</WindowLabel>
            <h3 className="mt-3 font-display text-lg text-bone">Build Your Crew</h3>
            <ul className="mt-4 space-y-3">
              <CheckItem
                title="Six specialists"
                body="Stealth, firepower, escape and risk stats average into a squad profile that decides how the job resolves."
              />
            </ul>
          </HudFrame>
        </div>

        <div className="mt-5">
          <HudFrame>
            <WindowLabel>mission.run</WindowLabel>
            <h3 className="mt-3 font-display text-lg text-bone">Run the Mission</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <CheckItem
                title="Phase-by-phase simulation"
                body="Narration and radio chatter roll your plan and squad stats against a location-adjusted target."
              />
              <CheckItem
                title="Four verdicts, five heat levels"
                body="Clean, Messy, Burned or Busted — plus a 0–5 GTA-style wanted rating and a payout you can export."
              />
            </ul>
          </HudFrame>
        </div>
      </section>

      {/* CREW PREVIEW */}
      <section id="crew" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <WindowLabel>crew.roster — preview</WindowLabel>
          <h2 className="mt-3 text-3xl font-bold text-bone sm:text-4xl">
            Assemble the <span className="text-signal-pink">right</span> squad.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {CREW.map((member) => (
            <HudFrame key={member.id} className="text-center">
              <span className="text-3xl">{member.icon}</span>
              <p className="mt-2 font-display text-xs uppercase tracking-[0.25em] text-dusk-blue/80">
                {member.role}
              </p>
              <p className="mt-1 font-display text-base text-bone">{member.name}</p>
              <p className="mt-2 text-sm text-bone/50">{member.bio}</p>
            </HudFrame>
          ))}
        </div>
      </section>

      {/* THE PLAN / PAYOFF */}
      <section id="plan" className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <HudFrame>
          <WindowLabel>payout.calc</WindowLabel>
          <h3 className="mt-3 font-display text-xl text-bone">
            A lazy plan pays less. A marked-up one pays out.
          </h3>
          <ul className="mt-5 space-y-3">
            <CheckItem
              title="Blueprint detail score"
              body="Your finished blueprint is diffed against the untouched photo on a downsampled grid — a real 0–100 score, not a guess."
            />
            <CheckItem
              title="Resumable, exportable"
              body="Progress persists in sessionStorage, and the finished blueprint downloads as a PNG or shares natively."
            />
          </ul>
        </HudFrame>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 pb-24 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-bone sm:text-4xl">Every job starts with a plan.</h2>
        <button
          type="button"
          onClick={() => navigate('/operation')}
          className="group relative border border-signal-pink px-8 py-3 font-display text-base text-signal-pink shadow-[0_0_25px_-5px_rgba(232,130,63,0.6)] transition-all hover:bg-signal-pink hover:text-void hover:shadow-[0_0_35px_-3px_rgba(232,130,63,0.9)]"
        >
          ▸ Build a Mission
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-dusk-blue/10 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 font-display text-[10px] uppercase tracking-[0.25em] text-bone/30 sm:flex-row sm:px-6">
          <span>© 2026 Mission//Ctrl</span>
          <span>MISSION CONTROL · VICE-COAST · CHANNEL SECURE</span>
        </div>
      </footer>
    </div>
  )
}
