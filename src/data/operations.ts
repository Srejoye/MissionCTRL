export interface Operation {
  id: string
  name: string
  tagline: string
  icon: string
}

export const OPERATIONS: Operation[] = [
  {
    id: 'heist',
    name: 'Heist',
    tagline: 'Get in, take what you came for, get out clean.',
    icon: '💰',
  },
  {
    id: 'getaway',
    name: 'Getaway',
    tagline: 'The job is already done. Now just survive the drive.',
    icon: '🏁',
  },
  {
    id: 'extraction',
    name: 'Extraction',
    tagline: 'Someone needs to disappear. You make that happen.',
    icon: '🎯',
  },
  {
    id: 'delivery',
    name: 'Delivery',
    tagline: 'Package changes hands. No questions, no delays.',
    icon: '📦',
  },
  {
    id: 'sabotage',
    name: 'Sabotage',
    tagline: 'Make sure it never works again.',
    icon: '💣',
  },
  {
    id: 'infiltration',
    name: 'Infiltration',
    tagline: 'Walk in as someone else. Walk out as yourself.',
    icon: '🕶️',
  },
]