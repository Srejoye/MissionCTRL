const GRID_W = 240
const GRID_H = 150
const CHANGED_THRESHOLD = 120
const FULL_DETAIL_COVERAGE = 0.025

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load image'))
    image.src = src
  })
}

function sample(image: HTMLImageElement): Uint8ClampedArray {
  const canvas = document.createElement('canvas')
  canvas.width = GRID_W
  canvas.height = GRID_H
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas unavailable')
  context.drawImage(image, 0, 0, GRID_W, GRID_H)
  return context.getImageData(0, 0, GRID_W, GRID_H).data
}

export async function measureBlueprintDetail(
  originalUrl: string,
  blueprintUrl: string | null
): Promise<number> {
  if (!blueprintUrl) return 0

  try {
    const [original, blueprint] = await Promise.all([
      loadImage(originalUrl),
      loadImage(blueprintUrl),
    ])
    const a = sample(original)
    const b = sample(blueprint)

    let changed = 0
    for (let i = 0; i < a.length; i += 4) {
      const delta =
        Math.abs(a[i] - b[i]) +
        Math.abs(a[i + 1] - b[i + 1]) +
        Math.abs(a[i + 2] - b[i + 2])
      if (delta > CHANGED_THRESHOLD) changed += 1
    }

    const coverage = changed / (GRID_W * GRID_H)
    return Math.round(Math.min(1, coverage / FULL_DETAIL_COVERAGE) * 100)
  } catch {
    return 0
  }
}
