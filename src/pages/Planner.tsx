import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageShell } from '../components/layout/PageShell'
import { StepIndicator } from '../components/layout/StepIndicator'
import { IntelBoard } from '../components/planner/IntelBoard'
import {
  MissionPlanner,
  type PlannerControls,
} from '../components/planner/MissionPlanner'
import { PlannerToolbar } from '../components/planner/PlannerToolbar'
import { useMission } from '../context/MissionContext'

const STEP_LABELS = ['Setup', 'Planner', 'Crew', 'Briefing']

export function Planner() {
  const navigate = useNavigate()
  const { mission, setBlueprintDataUrl, setIntelBonus } = useMission()
  const planner = useRef<PlannerControls>(null)
  const [editorReady, setEditorReady] = useState(false)
  const [showIntel, setShowIntel] = useState(false)

  const originalImage = mission.location!.imageUrl

  const [startingImage] = useState(
    () => mission.blueprintDataUrl ?? originalImage
  )

  const canContinue = editorReady || Boolean(mission.blueprintDataUrl)

  const handleContinue = () => {
    planner.current?.captureBlueprint()
    navigate('/crew')
  }

  return (
    <PageShell>
      <StepIndicator current={2} labels={STEP_LABELS} />
      <h2 className="mt-4 font-display text-2xl text-bone">Mission Planner</h2>
      <p className="mt-2 text-bone/60">
        Planning: <span className="text-dusk-blue">{mission.location?.name}</span>
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-bone/50">
          {mission.intelBonus > 0 ? (
            <>
              Intel on file:{' '}
              <span className="text-signal-pink">+{mission.intelBonus}</span>{' '}
              plan detail bonus.
            </>
          ) : (
            'Optional: get eyes on the location before you plan the route.'
          )}
        </p>
        <button
          type="button"
          onClick={() => setShowIntel(true)}
          className="border border-dusk-blue px-4 py-1.5 font-display text-xs text-dusk-blue transition-colors hover:bg-dusk-blue/10"
        >
          {mission.intelBonus > 0 ? 'Review Intel' : 'Gather Intel'}
        </button>
      </div>

      <div className="mt-4">
        <PlannerToolbar />
        <MissionPlanner
          imageUrl={startingImage}
          originalImageUrl={originalImage}
          onSaveBlueprint={setBlueprintDataUrl}
          onResetBlueprint={() => setBlueprintDataUrl(null)}
          onReady={() => setEditorReady(true)}
          controlRef={planner}
        />
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        className="mt-8 self-start border border-signal-pink px-6 py-2 font-display text-bone transition-colors hover:bg-signal-pink hover:text-void disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bone"
      >
        Continue to Crew
      </button>

      {showIntel && (
        <IntelBoard
          locationImageUrl={originalImage}
          locationName={mission.location?.name ?? 'Unknown'}
          onResolve={(bonus) => {
            setIntelBonus(bonus)
            setShowIntel(false)
          }}
          onClose={() => setShowIntel(false)}
        />
      )}
    </PageShell>
  )
}
