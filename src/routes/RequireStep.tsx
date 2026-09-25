import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useMission, type MissionState } from '../context/MissionContext'

interface RequireStepProps {
  when: (mission: MissionState) => boolean
  fallback: string
  children: ReactNode
}

export function RequireStep({ when, fallback, children }: RequireStepProps) {
  const { mission } = useMission()

  if (!when(mission)) {
    return <Navigate to={fallback} replace />
  }

  return children
}