import { useState } from 'react'

interface ExportActionsProps {
  blueprintDataUrl: string
  filename?: string
  shareTitle?: string
  downloadLabel?: string
  shareLabel?: string
}

type ShareStatus = 'idle' | 'sharing' | 'shared' | 'unsupported' | 'error'

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type || 'image/png' })
}

export function ExportActions({
  blueprintDataUrl,
  filename = 'mission-blueprint.png',
  shareTitle = 'MISSION//CTRL blueprint',
  downloadLabel = 'Download Blueprint',
  shareLabel = 'Share Blueprint',
}: ExportActionsProps) {
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle')

  const handleShare = async () => {
    setShareStatus('sharing')
    try {
      const file = await dataUrlToFile(blueprintDataUrl, filename)

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
          text: 'Every job starts with a plan.',
        })
        setShareStatus('shared')
      } else {
        setShareStatus('unsupported')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setShareStatus('idle')
      } else {
        setShareStatus('error')
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={blueprintDataUrl}
        download={filename}
        className="border border-dusk-blue px-6 py-2 font-display text-bone transition-colors hover:bg-dusk-blue hover:text-void"
      >
        {downloadLabel}
      </a>

      <button
        type="button"
        onClick={handleShare}
        className="border border-signal-pink px-6 py-2 font-display text-bone transition-colors hover:bg-signal-pink hover:text-void"
      >
        {shareLabel}
      </button>

      <ShareStatusLine status={shareStatus} />
    </div>
  )
}

function ShareStatusLine({ status }: { status: ShareStatus }) {
  switch (status) {
    case 'sharing':
      return <span className="text-sm text-bone/50">Opening share sheet…</span>
    case 'shared':
      return <span className="text-sm text-dusk-blue">Shared</span>
    case 'unsupported':
      return (
        <span className="text-sm text-bone/50">
          Sharing isn't supported on this browser — use Download instead.
        </span>
      )
    case 'error':
      return (
        <span className="text-sm text-sunfade-orange">
          Couldn't share that. Try Download instead.
        </span>
      )
    case 'idle':
      return null
  }
}