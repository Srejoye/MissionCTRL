import { useMemo, useRef, useState } from 'react'
import ImageEditor, {
  type ImageEditorRef,
} from '@unlayer/react-image-editor'

import type { CrewMember } from '../../data/crew'
import type { MissionOutcome } from '../../lib/missionSimulation'
import { generateBulletinImage } from '../../lib/wantedBulletin'
import { HudFrame } from '../layout/HudFrame'
import { ExportActions } from './ExportActions'

interface WantedBulletinEditorProps {
  outcome: MissionOutcome
  crew: CrewMember[]
  operationName: string
  locationName: string
  onClose: () => void
}

type Status = 'loading' | 'ready' | 'stamped' | 'image-error'

const EDITOR_OPTIONS = {
  theme: 'dark' as const,
  translations: {
    en: {
      'image_editor.tools.draw': 'Redact',
      'image_editor.tools.text': 'Case Notes',
      'image_editor.tools.shapes': 'Mark',
      'image_editor.tools.stickers': 'Stamp',
      'image_editor.tools.filter': 'Scan Grade',
      'image_editor.toolbar.save': 'File Bulletin',
      'image_editor.toolbar.cancel': 'Discard',
    },
  },
  features: {
    imageEditor: {
      tools: { resize: false, frame: false },
    },
  },
}

/**
 * A second, differently-retheed instance of the same image editor used
 * for blueprint planning — this one is set up for stamping an already
 * generated "Wanted" bulletin (case notes, redaction bars, a stamp)
 * rather than drawing a route, so the toolbar is relabeled accordingly
 * and the source image comes from wantedBulletin.ts, not a location photo.
 */
export function WantedBulletinEditor({
  outcome,
  crew,
  operationName,
  locationName,
  onClose,
}: WantedBulletinEditorProps) {
  const editorRef = useRef<ImageEditorRef>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [finalDataUrl, setFinalDataUrl] = useState<string | null>(null)

  const bulletinImage = useMemo(
    () => generateBulletinImage(outcome, crew, operationName, locationName),
    [outcome, crew, operationName, locationName]
  )

  const handleFile = () => {
    const dataUrl = editorRef.current?.editor?.getImage() ?? null
    if (dataUrl) {
      setFinalDataUrl(dataUrl)
      setStatus('stamped')
    }
  }

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-void/95 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-signal-pink">
              Vice PD Records
            </p>
            <h2 className="mt-1 font-display text-xl text-bone">
              Wanted Bulletin
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

        {!bulletinImage ? (
          <p className="mt-6 text-sm text-sunfade-orange">
            Couldn't generate the bulletin image on this device.
          </p>
        ) : finalDataUrl ? (
          <div className="mt-4">
            <HudFrame className="!p-1.5">
              <img
                src={finalDataUrl}
                alt={`Wanted bulletin for ${crew.map((m) => m.name).join(', ')}`}
                className="w-full"
              />
            </HudFrame>
            <div className="mt-4">
              <ExportActions
                blueprintDataUrl={finalDataUrl}
                filename="mission-ctrl-wanted-bulletin.png"
                shareTitle="MISSION//CTRL wanted bulletin"
                downloadLabel="Download Bulletin"
                shareLabel="Share Bulletin"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <HudFrame className="!p-0">
              <div className="flex items-center justify-between gap-3 border-b border-dusk-blue/20 px-4 py-2.5">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dusk-blue">
                  Case File
                </p>
                <StatusLine status={status} />
              </div>

              <ImageEditor
                ref={editorRef}
                image={bulletinImage}
                minHeight={640}
                options={EDITOR_OPTIONS}
                onLoad={() => setStatus('ready')}
                onSave={(result) => {
                  setFinalDataUrl(result.dataUrl)
                  setStatus('stamped')
                }}
                onCancel={onClose}
                onLoadError={() => setStatus('image-error')}
                onError={() => setStatus('image-error')}
              />

              <div className="flex items-center justify-between gap-3 border-t border-dusk-blue/20 px-4 py-3">
                <p className="text-xs text-bone/40">
                  Stamp it, redact it, add case notes — then file it.
                </p>
                <button
                  type="button"
                  onClick={handleFile}
                  className="border border-signal-pink px-4 py-1.5 font-display text-sm text-bone transition-colors hover:bg-signal-pink hover:text-void"
                >
                  File Bulletin
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
      return <span className="text-xs text-dusk-blue">Ready to stamp</span>
    case 'stamped':
      return <span className="text-xs text-signal-pink">Bulletin filed</span>
    case 'image-error':
      return (
        <span className="text-xs text-sunfade-orange">
          Couldn't load the bulletin image.
        </span>
      )
  }
}
