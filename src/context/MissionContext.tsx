import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

import type { CrewMember } from '../data/crew'
import type { Location } from '../data/locations'
import type { Operation } from '../data/operations'

const STORAGE_KEY = 'mission-ctrl/mission-state/v1'

export interface MissionState {
  operation: Operation | null
  location: Location | null
  blueprintDataUrl: string | null
  crew: CrewMember[]
  intelBonus: number
}

const EMPTY_STATE: MissionState = {
  operation: null,
  location: null,
  blueprintDataUrl: null,
  crew: [],
  intelBonus: 0,
}

function loadInitialState(): MissionState {
  if (typeof window === 'undefined') return EMPTY_STATE

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE

    const parsed = JSON.parse(raw) as Partial<MissionState>
    return {
      operation: parsed.operation ?? null,
      location: parsed.location ?? null,
      blueprintDataUrl: parsed.blueprintDataUrl ?? null,
      crew: parsed.crew ?? [],
      intelBonus: parsed.intelBonus ?? 0,
    }
  } catch (error) {
    console.warn('[mission-ctrl] Failed to read saved mission state', error)
    return EMPTY_STATE
  }
}

interface MissionContextValue {
  mission: MissionState
  setMission: Dispatch<SetStateAction<MissionState>>
  setOperation: (operation: Operation) => void
  setLocation: (location: Location) => void
  setBlueprintDataUrl: (dataUrl: string | null) => void
  setCrew: (crew: CrewMember[]) => void
  setIntelBonus: (bonus: number) => void
  resetMission: () => void
}

const MissionContext = createContext<MissionContextValue | null>(null)

export function MissionProvider({ children }: { children: ReactNode }) {
  const [mission, setMission] = useState<MissionState>(loadInitialState)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mission))
    } catch (error) {
      console.warn('[mission-ctrl] Failed to persist mission state', error)
    }
  }, [mission])

  const value = useMemo<MissionContextValue>(
    () => ({
      mission,
      setMission,
      setOperation: (operation) =>
        setMission((previous) => ({ ...previous, operation })),
      setLocation: (location) =>
        setMission((previous) => ({ ...previous, location })),
      setBlueprintDataUrl: (blueprintDataUrl) =>
        setMission((previous) => ({ ...previous, blueprintDataUrl })),
      setCrew: (crew) => setMission((previous) => ({ ...previous, crew })),
      setIntelBonus: (intelBonus) =>
        setMission((previous) => ({ ...previous, intelBonus })),
      resetMission: () => {
        setMission(EMPTY_STATE)
        try {
          window.sessionStorage.removeItem(STORAGE_KEY)
        } catch (error) {
          console.warn('[mission-ctrl] Failed to clear mission state', error)
        }
      },
    }),
    [mission]
  )

  return (
    <MissionContext.Provider value={value}>
      {children}
    </MissionContext.Provider>
  )
}

export function useMission(): MissionContextValue {
  const context = useContext(MissionContext)
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider')
  }
  return context
}