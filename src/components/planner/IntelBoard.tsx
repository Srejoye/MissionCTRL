import { useRef, useState } from 'react'
import ImageEditor, {
  type ImageEditorRef,
} from '@unlayer/react-image-editor'

import { measureBlueprintDetail } from '../../lib/blueprintDetail'
import { HudFrame } from '../layout/HudFrame'

interface IntelBoardProps {
  locationImageUrl: string
  locationName: string
  onResolve: (intelBonus: number) => void
  onClose: () => void
}

type Status = 'loading' | 'ready' | 'scoring' | 'scored' | 'image-error'

const MAX_INTEL_BONUS = 15

const EDITOR_OPTIONS = {
  theme: 'dark' as const,
  translations: {
    en: {
      'image_editor.tools.draw': 'Circle It',
      'image_editor.tools.text': 'Note',
      'image_editor.tools.shapes': 'Flag Zone',
      'image_editor.tools.stickers': 'Tag',
      'image_editor.tools.filter': 'Enhance',
      'image_editor.toolbar.save': 'Submit Intel',
      'image_editor.toolbar.cancel': 'Drop It',
    },
  },
  features: {
    imageEditor: {
      tools: { resize: false, frame: false },
    },
  },
}

/**
 * A third, differently-purposed instance of the same image editor used
 * for blueprint planning — here it's an investigation tool, not a
 * drawing one. The player is handed a grainy tip-off photo of the
 * location and has to circle/flag/note whatever looks off before the
 * job. Whatever they mark is scored the same way a blueprint is (a
 * pixel diff against the clean photo), and that score becomes a small,
 * real bonus folded into plan detail back on the Briefing page — this
 * doesn't duplicate the planner, it's a separate genre of editor use
 * (deduction, not route-drawing) with its own small payoff.
 */
export function IntelBoard({
  locationImageUrl,
  locationName,
  onResolve,
  onClose,
}: IntelBoardProps) {
  const editorRef = useRef<ImageEditorRef>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [bonus, setBonus] = useState<number | null>(null)

  const scoreAndResolve = async (markedUpDataUrl: string) => {
    setStatus('scoring')
    const coverage = await measureBlueprintDetail(
      locationImageUrl,
      markedUpDataUrl
    )
    const earned = Math.round((coverage / 100) * MAX_INTEL_BONUS)
    setBonus(earned)
    setStatus('scored')
  }

  const handleSubmit = () => {
    const dataUrl = editorRef.current?.editor?.getImage() ?? null
    if (dataUrl) scoreAndResolve(dataUrl)
  }

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-void/95 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-signal-pink">
              Informant Drop
            </p>
            <h2 className="mt-1 font-display text-xl text-bone">
              Intel: {locationName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-bone/20 px-3 py-1.5 font-display text-xs text-bone/60 transition-colors hover:border-bone/50 hover:text-bone"
          >
            Close
          </button>
        </div>

        {status === 'scored' && bonus !== null ? (
          <div className="mt-6">
            <HudFrame>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-dusk-blue">
                Intel filed
              </p>
              <p className="mt-2 text-bone/80">
                Whatever you flagged is worth acting on. This adds{' '}
                <span className="text-signal-pink">+{bonus}</span> to your
                plan detail once the job runs.
              </p>
              <button
                type="button"
                onClick={() => onResolve(bonus)}
                className="mt-4 border border-signal-pink px-5 py-2 font-display text-sm text-bone transition-colors hover:bg-signal-pink hover:text-void"
              >
                Back to Planning
              </button>
            </HudFrame>
          </div>
        ) : (
          <div className="mt-4">
            <p className="mb-3 text-xs text-bone/50">
              A grainy tip-off photo, nothing official. Circle anything that
              looks off — a blind spot, a patrol point, a way in — before you
              plan the route.
            </p>
            <HudFrame className="!p-0">
              <div className="flex items-center justify-between gap-3 border-b border-dusk-blue/20 px-4 py-2.5">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dusk-blue">
                  Tip-Off Photo
                </p>
                <StatusLine status={status} />
              </div>

              <div className="grayscale contrast-125 brightness-[0.65]">
                <ImageEditor
                  ref={editorRef}
                  image={locationImageUrl}
                  minHeight={560}
                  options={EDITOR_OPTIONS}
                  onLoad={() => setStatus('ready')}
                  onSave={(result) => scoreAndResolve(result.dataUrl)}
                  onCancel={onClose}
                  onLoadError={() => setStatus('image-error')}
                  onError={() => setStatus('image-error')}
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-dusk-blue/20 px-4 py-3">
                <p className="text-xs text-bone/40">
                  Only worth it if you actually mark something up.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === 'scoring'}
                  className="border border-signal-pink px-4 py-1.5 font-display text-sm text-bone transition-colors hover:bg-signal-pink hover:text-void disabled:cursor-wait disabled:opacity-60"
                >
                  {status === 'scoring' ? 'Filing…' : 'Submit Intel'}
                </button>
              </div>
            </HudFrame>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusLine({ status }: { status: Status }) {
  switch (status) {
    case 'loading':
      return <span className="text-xs text-bone/50">Pulling the file…</span>
    case 'ready':
      return <span className="text-xs text-dusk-blue">Ready</span>
    case 'scoring':
      return <span className="text-xs text-bone/50">Filing intel…</span>
    case 'scored':
      return <span className="text-xs text-signal-pink">Filed</span>
    case 'image-error':
      return (
        <span className="text-xs text-sunfade-orange">
          Couldn't load the tip-off photo.
        </span>
      )
  }
}
