import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { HudFrame } from '../components/layout/HudFrame'
import { PageShell } from '../components/layout/PageShell'
import { StepIndicator } from '../components/layout/StepIndicator'
import { WebcamCapture } from '../components/planner/WebcamCapture'
import { OPERATIONS, type Operation } from '../data/operations'
import { LOCATIONS, type Location } from '../data/locations'
import { useMission } from '../context/MissionContext'

const STEP_LABELS = ['Setup', 'Planner', 'Crew', 'Briefing']

const LIVE_RECON_ID = 'live-recon'

export function SelectOperation() {
  const navigate = useNavigate()
  const { mission, setOperation, setLocation } = useMission()
  const [showRecon, setShowRecon] = useState(false)

  const canContinue = Boolean(mission.operation && mission.location)
  const isLiveReconSelected = mission.location?.id === LIVE_RECON_ID

  function handleReconCapture(dataUrl: string) {
    setLocation({
      id: LIVE_RECON_ID,
      name: 'Unlisted (Scouted)',
      description: 'No file on this one. You scouted it yourself.',
      imageUrl: dataUrl,
    })
    setShowRecon(false)
  }

  return (
    <PageShell>
      <StepIndicator current={1} labels={STEP_LABELS} />
      <h2 className="mt-4 font-display text-2xl text-bone">Set Up the Job</h2>
      <p className="mt-2 text-bone/60">Pick the operation, then the location.</p>

      <div className="mt-6">
        <p className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-dusk-blue">
          <span className="flex h-4 w-4 items-center justify-center border border-dusk-blue text-[9px]">
            1
          </span>
          Operation
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {OPERATIONS.map((operation: Operation) => {
            const isSelected = mission.operation?.id === operation.id
            return (
              <button
                key={operation.id}
                type="button"
                onClick={() => setOperation(operation)}
                className="text-left"
              >
                <HudFrame
                  className={`h-full !p-3 transition-all ${
                    isSelected
                      ? 'border-signal-pink shadow-[0_0_16px_-4px_rgba(255,46,158,0.7)]'
                      : 'hover:border-dusk-blue hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">
                      {operation.icon}
                    </span>
                    <h3 className="font-display text-sm text-dusk-blue">
                      {operation.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs leading-snug text-bone/60">
                    {operation.tagline}
                  </p>
                </HudFrame>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <p className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-dusk-blue">
          <span className="flex h-4 w-4 items-center justify-center border border-dusk-blue text-[9px]">
            2
          </span>
          Location
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
          {LOCATIONS.map((location: Location) => {
            const isSelected = mission.location?.id === location.id
            return (
              <button
                key={location.id}
                type="button"
                onClick={() => setLocation(location)}
                className="text-left"
              >
                <HudFrame
                  className={`h-full !p-0 overflow-hidden transition-all ${
                    isSelected
                      ? 'border-signal-pink shadow-[0_0_16px_-4px_rgba(255,46,158,0.7)]'
                      : 'hover:border-dusk-blue hover:-translate-y-0.5'
                  }`}
                >
                  <div
                    className="relative h-16 w-full bg-cover bg-center sm:h-20"
                    style={{ backgroundImage: `url(${location.imageUrl})` }}
                    role="img"
                    aria-label={location.name}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(10,7,16,0.92), transparent 65%)',
                      }}
                    />
                    {isSelected && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center border border-signal-pink bg-void/80 text-[9px] text-signal-pink">
                        ✓
                      </span>
                    )}
                    <span className="absolute bottom-1 left-1.5 right-1.5 truncate font-display text-[10px] text-bone">
                      {location.name}
                    </span>
                  </div>
                </HudFrame>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => setShowRecon(true)}
            className="text-left"
          >
            <HudFrame
              className={`h-full !p-0 overflow-hidden border-dashed transition-all ${
                isLiveReconSelected
                  ? 'border-signal-pink shadow-[0_0_16px_-4px_rgba(255,46,158,0.7)]'
                  : 'hover:border-dusk-blue hover:-translate-y-0.5'
              }`}
            >
              <div
                className="relative flex h-16 w-full items-center justify-center bg-cover bg-center sm:h-20"
                style={
                  isLiveReconSelected
                    ? { backgroundImage: `url(${mission.location?.imageUrl})` }
                    : undefined
                }
                role="img"
                aria-label="Scout your own location"
              >
                {isLiveReconSelected && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(10,7,16,0.92), transparent 65%)',
                    }}
                  />
                )}
                {!isLiveReconSelected && (
                  <span className="text-lg" aria-hidden="true">
                    📷
                  </span>
                )}
                {isLiveReconSelected && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center border border-signal-pink bg-void/80 text-[9px] text-signal-pink">
                    ✓
                  </span>
                )}
                <span
                  className={`absolute bottom-1 left-1.5 right-1.5 truncate font-display text-[10px] ${
                    isLiveReconSelected ? 'text-bone' : 'text-dusk-blue'
                  }`}
                >
                  Scout Live
                </span>
              </div>
            </HudFrame>
          </button>
        </div>
      </div>

      {showRecon && (
        <WebcamCapture
          onCapture={handleReconCapture}
          onClose={() => setShowRecon(false)}
        />
      )}

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => navigate('/planner')}
        className="mt-8 self-start border border-signal-pink px-6 py-2 font-display text-bone shadow-[0_0_20px_-6px_rgba(255,46,158,0.7)] transition-all hover:bg-signal-pink hover:text-void disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none disabled:hover:bg-transparent disabled:hover:text-bone"
      >
        Continue to Planner →
      </button>
    </PageShell>
  )
}
