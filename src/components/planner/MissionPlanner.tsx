import { useImperativeHandle, useRef, useState, type Ref } from 'react'
import ImageEditor, {
  type ImageEditorRef,
} from '@unlayer/react-image-editor'

import { HudFrame } from '../layout/HudFrame'

export interface PlannerControls {
  captureBlueprint: () => string | null
}

interface MissionPlannerProps {
  imageUrl: string
  originalImageUrl: string
  onSaveBlueprint: (dataUrl: string) => void
  onResetBlueprint: () => void
  onReady?: () => void
  controlRef?: Ref<PlannerControls>
}

type EditorStatus =
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'saved' }
  | { kind: 'cancelled' }
  | { kind: 'image-error' }
  | { kind: 'wrapper-error'; message: string }

const EDITOR_OPTIONS = {
  theme: 'dark' as const,
  translations: {
    en: {
      'image_editor.tools.draw': 'Escape Route',
      'image_editor.tools.text': 'Label',
      'image_editor.tools.shapes': 'Mark Zone',
      'image_editor.tools.stickers': 'Intel',
      'image_editor.tools.filter': 'Night Vision',
      'image_editor.toolbar.save': 'Lock Plan',
      'image_editor.toolbar.cancel': 'Scrap',
    },
  },
  features: {
    imageEditor: {
      tools: { resize: false, frame: false },
    },
  },
}

export function MissionPlanner({
  imageUrl,
  originalImageUrl,
  onSaveBlueprint,
  onResetBlueprint,
  onReady,
  controlRef,
}: MissionPlannerProps) {
  const editorRef = useRef<ImageEditorRef>(null)
  const [status, setStatus] = useState<EditorStatus>({ kind: 'loading' })
  const [isPhone] = useState(
    () => window.matchMedia('(max-width: 639px)').matches
  )

  const captureBlueprint = () => {
    const dataUrl = editorRef.current?.editor?.getImage() ?? null
    if (dataUrl) onSaveBlueprint(dataUrl)
    return dataUrl
  }

  useImperativeHandle(controlRef, () => ({ captureBlueprint }))

  const handleSaveBlueprint = () => {
    if (captureBlueprint()) setStatus({ kind: 'saved' })
  }

  const handleReset = async () => {
    const editor = editorRef.current?.editor
    if (!editor) return
    if (editor.hasChanges() && !window.confirm('Scrap this plan and start over?')) {
      return
    }
    await editor.reset(originalImageUrl)
    onResetBlueprint()
    setStatus({ kind: 'ready' })
  }

  return (
    <div>
      <p className="mb-2 text-xs text-bone/40 sm:hidden">
        Tip: rotate your phone to landscape for a bigger canvas.
      </p>

      <HudFrame className="!p-0">
        <div className="flex items-center justify-between gap-3 border-b border-dusk-blue/20 px-4 py-2.5">
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dusk-blue">
            Blueprint Table
          </p>
          <StatusLine status={status} />
        </div>

        <ImageEditor
          ref={editorRef}
          image={imageUrl}
          minHeight={isPhone ? 680 : 560}
          options={EDITOR_OPTIONS}
          onLoad={() => {
            setStatus({ kind: 'ready' })
            onReady?.()
          }}
          onSave={(result) => {
            onSaveBlueprint(result.dataUrl)
            setStatus({ kind: 'saved' })
          }}
          onCancel={() => setStatus({ kind: 'cancelled' })}
          onLoadError={() => setStatus({ kind: 'image-error' })}
          onError={(error) =>
            setStatus({ kind: 'wrapper-error', message: error.message })
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dusk-blue/20 px-4 py-3">
          <p className="text-xs text-bone/40">
            Anything you draw is captured automatically when you continue.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="border border-bone/20 px-4 py-1.5 font-display text-sm text-bone/70 transition-colors hover:border-sunfade-orange hover:text-sunfade-orange"
            >
              Reset Plan
            </button>
            <button
              type="button"
              onClick={handleSaveBlueprint}
              className="border border-signal-pink px-4 py-1.5 font-display text-sm text-bone transition-colors hover:bg-signal-pink hover:text-void"
            >
              Save Blueprint
            </button>
          </div>
        </div>
      </HudFrame>
    </div>
  )
}

function StatusLine({ status }: { status: EditorStatus }) {
  switch (status.kind) {
    case 'loading':
      return <span className="text-xs text-bone/50">Loading planner…</span>
    case 'ready':
      return <span className="text-xs text-dusk-blue">Planner ready</span>
    case 'saved':
      return <span className="text-xs text-signal-pink">Blueprint saved</span>
    case 'cancelled':
      return <span className="text-xs text-bone/50">Edit scrapped</span>
    case 'image-error':
      return (
        <span className="text-xs text-sunfade-orange">
          Couldn't load that location image — try again or pick another
          location.
        </span>
      )
    case 'wrapper-error':
      return (
        <span className="text-xs text-sunfade-orange">
          Planner failed to load: {status.message}
        </span>
      )
  }
}
