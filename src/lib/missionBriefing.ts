import type { CrewStats } from '../data/crew'

const OBJECTIVES: Record<string, (locationName: string) => string> = {
  heist: (location) =>
    `Breach ${location}, secure the target, and be gone before anyone notices it's missing.`,
  getaway: (location) =>
    `The job's already done. Get the crew off ${location} without picking up a tail.`,
  extraction: (location) =>
    `Pull the target out of ${location} quietly. No noise, no witnesses.`,
  delivery: (location) =>
    `Move the package through ${location}. No detours, no questions.`,
  sabotage: (location) =>
    `Get into ${location} and make sure whatever's running there stops running — permanently.`,
  infiltration: (location) =>
    `Build a cover, walk into ${location}, and get out before anyone checks the badge twice.`,
}

export function getObjective(operationId: string, locationName: string): string {
  const build = OBJECTIVES[operationId]
  return build ? build(locationName) : `Complete the operation at ${locationName}.`
}

const BASE_PAYOUT: Record<string, number> = {
  heist: 250_000,
  getaway: 90_000,
  extraction: 160_000,
  delivery: 60_000,
  sabotage: 130_000,
  infiltration: 175_000,
}

export function getEstimatedPayout(operationId: string, squadStats: CrewStats): number {
  const base = BASE_PAYOUT[operationId] ?? 100_000
  const skillFactor = (squadStats.stealth + squadStats.firepower + squadStats.escape) / 300
  const payout = base * (1 + skillFactor)
  return Math.round(payout / 1000) * 1000
}

export function formatPayout(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

export type RiskTier = 'Low' | 'Medium' | 'High'

export function getRiskTier(risk: number): RiskTier {
  if (risk < 34) return 'Low'
  if (risk < 67) return 'Medium'
  return 'High'
}