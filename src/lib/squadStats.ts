import type { CrewMember, CrewStats } from '../data/crew'

export function averageSquadStats(crew: CrewMember[]): CrewStats {
  if (crew.length === 0) {
    return { stealth: 0, firepower: 0, escape: 0, risk: 0 }
  }

  const total = crew.reduce(
    (sum, member) => ({
      stealth: sum.stealth + member.stats.stealth,
      firepower: sum.firepower + member.stats.firepower,
      escape: sum.escape + member.stats.escape,
      risk: sum.risk + member.stats.risk,
    }),
    { stealth: 0, firepower: 0, escape: 0, risk: 0 }
  )

  return {
    stealth: Math.round(total.stealth / crew.length),
    firepower: Math.round(total.firepower / crew.length),
    escape: Math.round(total.escape / crew.length),
    risk: Math.round(total.risk / crew.length),
  }
}