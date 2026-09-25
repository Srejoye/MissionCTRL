import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageShell } from '../components/layout/PageShell'
import { StepIndicator } from '../components/layout/StepIndicator'
import { BriefingSheet } from '../components/briefing/BriefingSheet'
import { ExportActions } from '../components/briefing/ExportActions'
import { MissionRun } from '../components/briefing/MissionRun'
import { useMission } from '../context/MissionContext'
import { measureBlueprintDetail } from '../lib/blueprintDetail'

const STEP_LABELS = ['Setup', 'Planner', 'Crew', 'Briefing']

export function Briefing() {
  const navigate = useNavigate()
  const { mission, resetMission } = useMission()
  const [planDetail, setPlanDetail] = useState<number | null>(null)
  const [starting, setStarting] = useState(false)

  const { operation, location } = mission
  if (!operation || !location) return null

  const createAnother = () => {
    resetMission()
    navigate('/')
  }

  const startOperation = async () => {
    setStarting(true)
    const detail = await measureBlueprintDetail(location.imageUrl, mission.blueprintDataUrl)
    setPlanDetail(Math.min(100, detail + mission.intelBonus))
    setStarting(false)
  }

  if (planDetail !== null) {
    return (
      <MissionRun
        operation={operation}
        location={location}
        crew={mission.crew}
        blueprintDataUrl={mission.blueprintDataUrl}
        planDetail={planDetail}
        onRevisePlan={() => navigate('/planner')}
        onReturn={createAnother}
      />
    )
  }

  return (
    <PageShell>
      <StepIndicator current={4} labels={STEP_LABELS} />
      <h2 className="mt-4 font-display text-2xl text-bone">Mission Briefing</h2>

      <div className="mt-6">
        <BriefingSheet
          mission={{
            operation,
            location,
            crew: mission.crew,
            blueprintDataUrl: mission.blueprintDataUrl,
          }}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={startOperation}
          disabled={starting}
          className="border border-signal-pink bg-signal-pink px-6 py-2 font-display text-void shadow-[0_0_25px_-5px_rgba(255,46,158,0.8)] transition-all hover:opacity-90 hover:shadow-[0_0_35px_-3px_rgba(255,46,158,1)] disabled:cursor-wait disabled:opacity-60"
        >
          {starting ? 'Starting…' : 'Start Operation'}
        </button>

        {mission.intelBonus > 0 && (
          <span className="text-xs text-bone/50">
            Intel on file:{' '}
            <span className="text-signal-pink">+{mission.intelBonus}</span>{' '}
            plan detail
          </span>
        )}

        {mission.blueprintDataUrl && (
          <ExportActions blueprintDataUrl={mission.blueprintDataUrl} />
        )}

        <button
          type="button"
          onClick={createAnother}
          className="border border-dusk-blue px-6 py-2 font-display text-bone transition-colors hover:bg-dusk-blue hover:text-void"
        >
          Create Another
        </button>
      </div>
    </PageShell>
  )
}