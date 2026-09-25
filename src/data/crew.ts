export interface CrewStats {
  stealth: number
  firepower: number
  escape: number
  risk: number
}

export interface CrewMember {
  id: string
  role: string
  name: string
  bio: string
  stats: CrewStats
  icon: string
}

export const CREW: CrewMember[] = [
  {
    id: 'driver',
    role: 'Driver',
    name: 'Marisol "Redline" Vega',
    bio: 'Never taken the same route twice. Never needs to.',
    stats: { stealth: 40, firepower: 20, escape: 95, risk: 30 },
    icon: '🏁',
  },
  {
    id: 'hacker',
    role: 'Hacker',
    name: 'Theo Marsh',
    bio: 'Cameras go quiet exactly when he needs them to.',
    stats: { stealth: 70, firepower: 10, escape: 40, risk: 25 },
    icon: '💻',
  },
  {
    id: 'gunman',
    role: 'Gunman',
    name: 'Dutch Alvarez',
    bio: 'Plan B, in case plan A gets loud.',
    stats: { stealth: 25, firepower: 90, escape: 45, risk: 65 },
    icon: '🔫',
  },
  {
    id: 'insider',
    role: 'Insider',
    name: 'Priya Nandy',
    bio: 'Already has a badge. Already knows the shift change.',
    stats: { stealth: 60, firepower: 15, escape: 30, risk: 55 },
    icon: '🪪',
  },
  {
    id: 'medic',
    role: 'Medic',
    name: 'Dr. Elena Cross',
    bio: "Doesn't ask what happened. Just closes the wound.",
    stats: { stealth: 35, firepower: 15, escape: 50, risk: 20 },
    icon: '🩹',
  },
  {
    id: 'demolitions',
    role: 'Demolitions',
    name: 'Ozzy Kade',
    bio: "If it's locked, it won't be for long.",
    stats: { stealth: 20, firepower: 75, escape: 35, risk: 70 },
    icon: '🧨',
  },
]