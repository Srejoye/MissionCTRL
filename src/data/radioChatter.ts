export interface TickerLine {
  source: string
  text: string
  locationId?: string
}

export const RADIO_LINES: TickerLine[] = [
  // --- VICE WAVE 98.4 — late-night radio DJ (mostly ambient) ---
  {
    source: 'VICE WAVE 98.4',
    text: "Ninety-two degrees at midnight and the AC in this booth still isn't working.",
  },
  {
    source: 'VICE WAVE 98.4',
    text: "Traffic on the causeway isn't moving, so neither is your alibi.",
  },
  {
    source: 'VICE WAVE 98.4',
    text: "That's the last request we're taking tonight. After this, it's just static and sirens.",
  },
  {
    source: 'VICE WAVE 98.4',
    text: 'Somebody call in and tell us why there are three helicopters over the marina.',
    locationId: 'private-yacht',
  },
  {
    source: 'VICE WAVE 98.4',
    text: 'Keep it locked, keep it low, and if you see something, for once, say nothing.',
  },

  // --- LEONWOOD NOW — local news ---
  {
    source: 'LEONWOOD NOW',
    text: 'Police say the marina break-in is the third this month. No suspects, no surprise.',
    locationId: 'private-yacht',
  },
  {
    source: 'LEONWOOD NOW',
    text: 'A warehouse fire near the Glades was, in the words of the fire chief, "not an accident."',
    locationId: 'warehouse',
  },
  {
    source: 'LEONWOOD NOW',
    text: "City hall says the new dock cameras are 'fully operational.' Sure they are.",
    locationId: 'vice-docks',
  },
  {
    source: 'LEONWOOD NOW',
    text: 'A break-in at a Sunset Tower penthouse last week is still officially "under review."',
    locationId: 'rooftop-penthouse',
  },
  {
    source: 'LEONWOOD NOW',
    text: 'The mayor promises a full audit of casino floor security. The casino promises nothing.',
    locationId: 'casino-floor',
  },
  {
    source: 'LEONWOOD NOW',
    text: 'Coast guard pulled two empty go-fast boats out of the channel this morning. No word on the crews.',
  },

  // --- CORAL ROW WEATHER — Coral Row / nightclub strip ---
  {
    source: 'CORAL ROW WEATHER',
    text: 'Storm sitting offshore, going nowhere. Keep the windows shut and the doors locked.',
    locationId: 'nightclub',
  },
  {
    source: 'CORAL ROW WEATHER',
    text: 'Humidity at ninety-eight percent. The whole city feels like a held breath tonight.',
    locationId: 'nightclub',
  },
  {
    source: 'CORAL ROW WEATHER',
    text: 'Lightning out past the docks. No rain yet. Just the light show.',
    locationId: 'nightclub',
  },

  // --- FLAMINGO CASINO PA ---
  {
    source: 'FLAMINGO CASINO PA',
    text: 'Attention guests: the high-limit floor closes at four. Please cash out before then.',
    locationId: 'casino-floor',
  },
  {
    source: 'FLAMINGO CASINO PA',
    text: 'Lost property desk is now closed. Please retain your claim ticket until tomorrow.',
    locationId: 'casino-floor',
  },
  {
    source: 'FLAMINGO CASINO PA',
    text: 'A friendly reminder: all bags are subject to search on the way out, not just the way in.',
    locationId: 'casino-floor',
  },

  // --- HARBOR ADVISORY — Vice Docks / Marina Row shipping traffic ---
  {
    source: 'HARBOR ADVISORY',
    text: 'Container inspections resume at Vice Docks 0600. Expect delays through the morning shift.',
    locationId: 'vice-docks',
  },
  {
    source: 'HARBOR ADVISORY',
    text: 'Marina Row berths 12 through 18 closed for "maintenance." No further details given.',
    locationId: 'private-yacht',
  },
  {
    source: 'HARBOR ADVISORY',
    text: 'A crane operator on the night shift reports a container short on the manifest. Again.',
    locationId: 'vice-docks',
  },
  {
    source: 'HARBOR ADVISORY',
    text: 'Harbor patrol boat is running with its lights off tonight. Draw your own conclusions.',
  },

  // --- SUNSET TOWER CONCIERGE ---
  {
    source: 'SUNSET TOWER CONCIERGE',
    text: 'Reminder to residents: the service elevator is for staff only after 10 p.m.',
    locationId: 'rooftop-penthouse',
  },
  {
    source: 'SUNSET TOWER CONCIERGE',
    text: 'The rooftop is closed this evening for a private function. Please use the east stairwell.',
    locationId: 'rooftop-penthouse',
  },
  {
    source: 'SUNSET TOWER CONCIERGE',
    text: 'Housekeeping reports a guest key was reissued twice today. Front desk is "looking into it."',
    locationId: 'rooftop-penthouse',
  },

  // --- EVERGLADE ADVISORY — swamp/warehouse yard ---
  {
    source: 'EVERGLADE ADVISORY',
    text: 'Airboat traffic up near the yard again tonight. Rangers say it is "recreational."',
    locationId: 'warehouse',
  },
  {
    source: 'EVERGLADE ADVISORY',
    text: 'A cargo yard off the old canal road reported a break-in. Nothing was reported stolen.',
    locationId: 'warehouse',
  },
  {
    source: 'EVERGLADE ADVISORY',
    text: 'Fog rolling in off the swamp early tonight. Visibility past the yard fence near zero.',
    locationId: 'warehouse',
  },

  // --- OCEAN DRIVE TRAFFIC ---
  {
    source: 'OCEAN DRIVE TRAFFIC',
    text: 'Three lanes down to one past the strip. Somebody left a very expensive car in the road.',
    locationId: 'downtown',
  },
  {
    source: 'OCEAN DRIVE TRAFFIC',
    text: 'A patrol unit is running plates at the corner of 5th. Might want to take the long way.',
    locationId: 'downtown',
  },
  {
    source: 'OCEAN DRIVE TRAFFIC',
    text: 'Camera outage reported along three blocks of Ocean Drive. City says it is "temporary."',
    locationId: 'downtown',
  },
]
