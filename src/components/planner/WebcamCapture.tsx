import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { HudFrame } from '../layout/HudFrame'

const MAX_DIMENSION = 1280
const JPEG_QUALITY = 0.75

interface WebcamCaptureProps {
  onCapture: (dataUrl: string) => void
  onClose: () => void
}

/**
 * Lets the player scout their own location instead of picking one of the
 * pre-set Vice locations: live camera feed with a capture button, falling
 * back to a plain file upload if the camera is unavailable or denied.
 * The result is downsized/re-compressed on a canvas before being handed
 * back, so it stays well within sessionStorage limits either way.
 */
export function WebcamCapture({ onCapture, onClose }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera not available on this device.')
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => setError('Camera unavailable or permission denied.'))

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function downscale(source: CanvasImageSource, width: number, height: number): string {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    const context = canvas.getContext('2d')
    if (!context) return ''
    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  }

  function capture() {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const dataUrl = downscale(video, video.videoWidth, video.videoHeight)
    if (dataUrl) setPhoto(dataUrl)
  }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const dataUrl = downscale(image, image.width, image.height)
        if (dataUrl) setPhoto(dataUrl)
      }
      image.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 p-4">
      <HudFrame className="w-full max-w-lg !p-4">
        <h3 className="font-display text-xs uppercase tracking-[0.3em] text-signal-pink">
          Live Recon
        </h3>
        <p className="mt-1 text-xs text-bone/60">
          No location on file — scout it yourself. Snap a photo to use as your blueprint.
        </p>

        <div className="mt-4 aspect-video overflow-hidden border border-dusk-blue/40 bg-black">
          {photo ? (
            <img
              src={photo}
              alt="Captured recon photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {error && (
          <div className="mt-3 text-xs text-signal-pink">
            {error}
            <label className="mt-2 block cursor-pointer border border-dusk-blue px-3 py-2 text-center text-bone/80 transition-colors hover:border-signal-pink">
              Upload a photo instead
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-bone/30 px-4 py-2 font-display text-xs text-bone/70 transition-colors hover:border-bone"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            {photo ? (
              <>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="border border-dusk-blue px-4 py-2 font-display text-xs text-dusk-blue transition-colors hover:bg-dusk-blue/10"
                >
                  Retake
                </button>
                <button
                  type="button"
                  onClick={() => onCapture(photo)}
                  className="border border-signal-pink px-4 py-2 font-display text-xs text-bone shadow-[0_0_16px_-4px_rgba(255,46,158,0.7)] transition-colors hover:bg-signal-pink hover:text-void"
                >
                  Use This Shot
                </button>
              </>
            ) : (
              !error && (
                <button
                  type="button"
                  onClick={capture}
                  className="border border-signal-pink px-4 py-2 font-display text-xs text-bone shadow-[0_0_16px_-4px_rgba(255,46,158,0.7)] transition-colors hover:bg-signal-pink hover:text-void"
                >
                  Capture
                </button>
              )
            )}
          </div>
        </div>
      </HudFrame>
    </div>
  )
}
