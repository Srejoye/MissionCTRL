import type { CrewMember } from '../data/crew'
import type { Location } from '../data/locations'
import type { Operation } from '../data/operations'
import { getEstimatedPayout } from './missionBriefing'
import { averageSquadStats } from './squadStats'

export type Verdict = 'clean' | 'messy' | 'burned' | 'busted'

export interface LogLine {
  kind: 'narration' | 'radio'
  text: string
}

export interface ScorePart {
  label: string
  value: number
}

export interface PhaseResult {
  id: string
  title: string
  lines: LogLine[]
  passed: boolean
  roll: number
  target: number
  parts: ScorePart[]
}

export interface MissionOutcome {
  verdict: Verdict
  headline: string
  summary: string
  phases: PhaseResult[]
  failedPhases: number
  payout: number
  planBonusPayout: number
  heat: number
}

export interface SimulationInput {
  operation: Operation
  location: Location
  crew: CrewMember[]
  planDetail: number
  seed?: number
}

type SkillKey = 'stealth' | 'firepower' | 'escape'
type Rng = () => number

function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]
}

const LOCATION_DIFFICULTY: Record<string, number> = {
  'vice-docks': 0,
  'private-yacht': 3,
  nightclub: 0,
  warehouse: 0,
  downtown: 2,
  'casino-floor': 6,
  'rooftop-penthouse': 4,
}

const INFILTRATE: Record<string, { pass: string; fail: string }> = {
  'vice-docks': {
    pass: 'You slip between the containers while the night-shift crane swings the other way.',
    fail: 'A floodlight swings around a container corner and pins you in the open.',
  },
  'private-yacht': {
    pass: "You come aboard with the catering crew. Nobody counts the caterers.",
    fail: "A deckhand squints at a face that isn't on the guest list.",
  },
  nightclub: {
    pass: 'The bass covers your footsteps. The strobe covers your faces.',
    fail: "The doorman's earpiece crackles. He is looking right at you.",
  },
  warehouse: {
    pass: 'The side door is still propped open from the last shift. Old habits.',
    fail: "A motion sensor you didn't plan for blinks red.",
  },
  downtown: {
    pass: 'You move with the crowd. Three blocks of cameras, zero good angles.',
    fail: 'A traffic camera swivels. Somebody is actually watching this one.',
  },
  'casino-floor': {
    pass: "The pit boss looks straight past you. You're just another tourist losing money.",
    fail: 'The eye in the sky tags you at the cage. Security starts walking.',
  },
  'rooftop-penthouse': {
    pass: 'The service elevator opens on a floor nobody guards. Rich people trust doors.',
    fail: 'The elevator chimes at the wrong floor. A guard is already waiting.',
  },
}

interface JobFlavor {
  title: string
  weights: Partial<Record<SkillKey, number>>
  pass: string
  fail: string
}

const JOB: Record<string, JobFlavor> = {
  heist: {
    title: 'The Take',
    weights: { stealth: 0.6, firepower: 0.4 },
    pass: "The target is in the bag. The vault didn't even sigh.",
    fail: 'The safe fights back. You leave with less than you came for.',
  },
  getaway: {
    title: 'The Pickup',
    weights: { escape: 1 },
    pass: "Doors slam, tires bite. The job is already behind you.",
    fail: 'A late arrival and a wrong turn. The crew piles in shouting.',
  },
  extraction: {
    title: 'The Extraction',
    weights: { stealth: 0.5, firepower: 0.5 },
    pass: 'The target walks out between two of your people, coat over the cuffs.',
    fail: 'The target panics, and a witness sees the whole thing.',
  },
  delivery: {
    title: 'The Handoff',
    weights: { stealth: 0.5, escape: 0.5 },
    pass: 'The case changes hands. Nobody says a word. Nobody needs to.',
    fail: 'The buyer counts twice. Something about the package smells wrong to him.',
  },
  sabotage: {
    title: 'The Sabotage',
    weights: { firepower: 0.7, stealth: 0.3 },
    pass: "The charge is placed. Whatever ran here won't run again.",
    fail: 'The rig only half-breaks. It will limp back online by morning.',
  },
  infiltration: {
    title: 'The Cover',
    weights: { stealth: 1 },
    pass: 'The badge scans green. You are officially someone else.',
    fail: 'The badge scanner hesitates, then beeps twice. Never a good sign.',
  },
}

const FALLBACK_JOB: JobFlavor = {
  title: 'The Job',
  weights: { stealth: 0.5, firepower: 0.5 },
  pass: 'The job gets done.',
  fail: 'The job gets done badly.',
}

interface Complication {
  id: string
  title: string
  intro: string
  skill: SkillKey
  specialist: string
  passWith: string
  passWithout: string
  fail: string
}

const COMPLICATIONS: Complication[] = [
  {
    id: 'alarm',
    title: 'Silent Alarm',
    intro: "A silent alarm just went out. The lights don't change. That's how you know.",
    skill: 'stealth',
    specialist: 'hacker',
    passWith: '{name} loops the feeds. Security watches an empty hallway for ninety seconds.',
    passWithout: 'You kill the panel with a fire axe and a lie. It holds.',
    fail: 'The alarm reaches the street. Somewhere, sirens start warming up.',
  },
  {
    id: 'lockdown',
    title: 'Shutters Drop',
    intro: 'Steel shutters slam down. The way you came in is gone.',
    skill: 'firepower',
    specialist: 'demolitions',
    passWith: '{name} sets a charge the size of a paperback. The shutter never sees it coming.',
    passWithout: 'You find a maintenance hatch through pure stubbornness.',
    fail: "The hatch is welded shut. You lose four minutes you didn't have.",
  },
  {
    id: 'wounded',
    title: 'Man Down',
    intro: 'Someone takes a round in the shoulder. The whole crew slows to a crawl.',
    skill: 'escape',
    specialist: 'medic',
    passWith: '{name} closes the wound in the back of a moving car. Nobody asks how.',
    passWithout: 'You improvise a tourniquet from a jacket and keep moving.',
    fail: "Blood on the stairwell. The trail leads exactly where you don't want it to.",
  },
  {
    id: 'tail',
    title: 'Cop On Your Plates',
    intro: 'A patrol car pulls out two lanes back. Same speed as you. Same turns.',
    skill: 'escape',
    specialist: 'driver',
    passWith: "{name} takes the next left through a parking structure. The patrol car doesn't get the memo.",
    passWithout: 'You run two reds and a fruit stand. Somehow it works.',
    fail: "The lights come on. So does everyone's heartbeat.",
  },
  {
    id: 'shakedown',
    title: 'The Inside Man Sweats',
    intro: "A guard asks for a second ID. Somebody's story isn't holding.",
    skill: 'stealth',
    specialist: 'insider',
    passWith: '{name} calls the guard by his first name and asks about his kid. The door opens.',
    passWithout: 'You bluff with a smile and a very confident clipboard.',
    fail: 'The guard reaches for his radio. It is a short, ugly conversation.',
  },
  {
    id: 'firefight',
    title: 'Security Gets Serious',
    intro: 'The guards stop being a deterrent and start being a problem.',
    skill: 'firepower',
    specialist: 'gunman',
    passWith: '{name} lays down cover like a professional. Nobody in the hallway wants to be brave.',
    passWithout: "You lay down what cover you can. It's ugly, but it's enough.",
    fail: 'Nobody is covering the corridor. The corridor fills with people you would rather not meet.',
  },
]

const CHATTER: Record<string, readonly string[]> = {
  driver: [
    "Engine's warm. Say the word.",
    "I've got six ways out of here. Pick one.",
    'Nobody on my mirrors. Yet.',
  ],
  hacker: [
    "I'm in. Don't touch anything I haven't touched.",
    'The cameras think it is a quiet night. Let us keep it that way.',
    'Give me thirty seconds and a little silence.',
  ],
  gunman: [
    "Just say when. I'd rather not.",
    'Plan A is fine. I brought plan B anyway.',
    'Eyes up. Nobody gets between us and that door.',
  ],
  insider: [
    'Shift change in four minutes. Walk like you belong.',
    'Smile. Confidence is ninety percent of a badge.',
    'Head down, hands visible, nobody looks twice.',
  ],
  medic: [
    "Nobody gets hurt today. That's not a promise, it's a request.",
    "I brought bandages. I'd love not to use them.",
    "Breathe. Everyone's fine until they're not.",
  ],
  demolitions: [
    'Small charge, big opinion.',
    "If it's locked, it's a suggestion.",
    'Stand back. Further. Yes, that far.',
  ],
}

const VERDICTS: Record<
  Verdict,
  { headline: string; summary: string; payoutShare: number }
> = {
  clean: {
    headline: 'Clean Getaway',
    summary: 'In and out. The city will never know you were there.',
    payoutShare: 1,
  },
  messy: {
    headline: 'Messy, But Done',
    summary: 'Sirens in the distance, money in the bag.',
    payoutShare: 0.65,
  },
  burned: {
    headline: 'Burned',
    summary: 'You got out. Barely. Half the take stayed behind.',
    payoutShare: 0.25,
  },
  busted: {
    headline: 'Busted',
    summary: 'The plan came apart at the seams. Time to lie low.',
    payoutShare: 0,
  },
}

export function callSign(member: CrewMember): string {
  const nickname = member.name.match(/"([^"]+)"/)
  if (nickname) return nickname[1]
  return member.name.replace(/^Dr\.\s+/, '').split(' ')[0]
}

const BASE_TARGET = 34
const LUCK_RANGE = 18
const PLAN_MAX_BONUS = 12
const SPECIALIST_BONUS = 25
const DRIVER_ESCAPE_BONUS = 10
const HEAT_PENALTY_PER_FAILURE = 5
const CREW_BONUS_PER_MEMBER = 2
const CREW_BONUS_MAX = 8

function weightedStat(
  stats: Record<SkillKey, number>,
  weights: Partial<Record<SkillKey, number>>
): number {
  let total = 0
  for (const key of Object.keys(weights) as SkillKey[]) {
    total += stats[key] * (weights[key] ?? 0)
  }
  return total * 0.6
}

const SKILL_LABEL: Record<SkillKey, string> = {
  stealth: 'Stealth',
  firepower: 'Firepower',
  escape: 'Escape',
}

function radioLine(rng: Rng, crew: CrewMember[], usedIds: Set<string>): LogLine {
  const fresh = crew.filter((member) => !usedIds.has(member.id))
  const speaker = pick(rng, fresh.length > 0 ? fresh : crew)
  usedIds.add(speaker.id)
  const lines = CHATTER[speaker.id] ?? ['Copy that.']
  return { kind: 'radio', text: `${callSign(speaker)}: “${pick(rng, lines)}”` }
}

export function simulateMission(input: SimulationInput): MissionOutcome {
  const { operation, location, crew, planDetail } = input
  const rng = mulberry32(input.seed ?? Math.floor(Math.random() * 2 ** 31))
  const stats = averageSquadStats(crew)
  const skills: Record<SkillKey, number> = {
    stealth: stats.stealth,
    firepower: stats.firepower,
    escape: stats.escape,
  }

  const difficulty = LOCATION_DIFFICULTY[location.id] ?? 2
  const target = BASE_TARGET + difficulty
  const planBonus = Math.round((planDetail / 100) * PLAN_MAX_BONUS)
  const crewBonus = Math.min(
    CREW_BONUS_MAX,
    Math.max(0, crew.length - 1) * CREW_BONUS_PER_MEMBER
  )
  const usedSpeakers = new Set<string>()
  const phases: PhaseResult[] = []

  const luck = () => Math.round((rng() * 2 - 1) * LUCK_RANGE)
  const failuresSoFar = () => phases.filter((phase) => !phase.passed).length

  const finish = (
    id: string,
    title: string,
    lines: LogLine[],
    parts: ScorePart[]
  ): PhaseResult => {
    const roll = parts.reduce((sum, part) => sum + part.value, 0)
    return { id, title, lines, parts, roll, target, passed: roll >= target }
  }

  {
    const flavor = INFILTRATE[location.id] ?? {
      pass: `You get inside ${location.name} without anyone noticing.`,
      fail: `${location.name} notices you before you notice it.`,
    }
    const parts: ScorePart[] = [
      { label: SKILL_LABEL.stealth, value: Math.round(skills.stealth * 0.6) },
      { label: 'Plan', value: planBonus },
      { label: 'Crew', value: crewBonus },
      { label: 'Luck', value: luck() },
    ]
    const phase = finish('infiltrate', 'Infiltrate', [], parts)
    phase.lines = [
      radioLine(rng, crew, usedSpeakers),
      { kind: 'narration', text: phase.passed ? flavor.pass : flavor.fail },
    ]
    phases.push(phase)
  }

  {
    const job = JOB[operation.id] ?? FALLBACK_JOB
    const parts: ScorePart[] = [
      { label: 'Skill', value: Math.round(weightedStat(skills, job.weights)) },
      { label: 'Plan', value: planBonus },
      { label: 'Crew', value: crewBonus },
      { label: 'Luck', value: luck() },
    ]
    const phase = finish('job', job.title, [], parts)
    phase.lines = [
      radioLine(rng, crew, usedSpeakers),
      { kind: 'narration', text: phase.passed ? job.pass : job.fail },
    ]
    phases.push(phase)
  }

  {
    const event = pick(rng, COMPLICATIONS)
    const specialist = crew.find((member) => member.id === event.specialist)
    const parts: ScorePart[] = [
      {
        label: SKILL_LABEL[event.skill],
        value: Math.round(skills[event.skill] * 0.6),
      },
      { label: 'Plan', value: planBonus },
      { label: 'Crew', value: crewBonus },
    ]
    if (specialist) {
      parts.push({ label: specialist.role, value: SPECIALIST_BONUS })
    }
    parts.push({ label: 'Luck', value: luck() })

    const phase = finish('complication', event.title, [], parts)
    const outcomeText = !phase.passed
      ? event.fail
      : specialist
        ? event.passWith.replace('{name}', callSign(specialist))
        : event.passWithout
    phase.lines = [
      { kind: 'narration', text: event.intro },
      { kind: 'narration', text: outcomeText },
    ]
    phases.push(phase)
  }

  {
    const driver = crew.find((member) => member.id === 'driver')
    const failures = failuresSoFar()
    const parts: ScorePart[] = [
      { label: SKILL_LABEL.escape, value: Math.round(skills.escape * 0.6) },
      { label: 'Plan', value: planBonus },
      { label: 'Crew', value: crewBonus },
    ]
    if (driver) parts.push({ label: driver.role, value: DRIVER_ESCAPE_BONUS })
    if (failures > 0) {
      parts.push({ label: 'Heat', value: -failures * HEAT_PENALTY_PER_FAILURE })
    }
    parts.push({ label: 'Luck', value: luck() })

    const phase = finish('escape', 'The Escape', [], parts)
    phase.lines = [
      radioLine(rng, crew, usedSpeakers),
      {
        kind: 'narration',
        text: phase.passed
          ? `You melt out of ${location.name} before the first unit arrives. The city swallows you whole.`
          : `The way out of ${location.name} is already full of blue lights.`,
      },
    ]
    phases.push(phase)
  }

  const failedPhases = failuresSoFar()
  const verdict: Verdict =
    failedPhases === 0
      ? 'clean'
      : failedPhases === 1
        ? 'messy'
        : failedPhases === 2
          ? 'burned'
          : 'busted'

  const { headline, summary, payoutShare } = VERDICTS[verdict]
  const basePayout = getEstimatedPayout(operation.id, stats) * payoutShare
  const planBonusPayout =
    Math.round((basePayout * (planDetail / 100) * 0.1) / 1000) * 1000
  const payout = Math.round(basePayout / 1000) * 1000 + planBonusPayout

  const heat = Math.max(0, Math.min(5, Math.round(failedPhases * 1.4 + stats.risk / 60)))

  return {
    verdict,
    headline,
    summary,
    phases,
    failedPhases,
    payout,
    planBonusPayout,
    heat,
  }
}