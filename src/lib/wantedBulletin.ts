import type { CrewMember } from '../data/crew'
import type { MissionOutcome } from './missionSimulation'
import { formatPayout } from './missionBriefing'

const WIDTH = 900
const HEIGHT = 1200

/**
 * Composes a Vice PD "Most Wanted" bulletin straight from the mission that
 * just ran — bounty, heat rating, verdict headline, and crew roster all
 * come from the same MissionOutcome the report screen already renders.
 * Nothing here is invented after the fact. The result is a flat PNG data
 * URL, handed to a second image-editor instance for stamping/annotation.
 */
export function generateBulletinImage(
  outcome: MissionOutcome,
  crew: CrewMember[],
  operationName: string,
  locationName: string
): string {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.fillStyle = '#0a0710'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.strokeStyle = '#ff2e9e'
  ctx.lineWidth = 6
  ctx.strokeRect(20, 20, WIDTH - 40, HEIGHT - 40)
  ctx.strokeStyle = '#7dd3fc'
  ctx.lineWidth = 1
  ctx.strokeRect(34, 34, WIDTH - 68, HEIGHT - 68)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ff2e9e'
  ctx.font = 'bold 34px sans-serif'
  ctx.fillText('VICE CITY PD', WIDTH / 2, 95)
  ctx.fillStyle = '#f3edf7'
  ctx.font = 'bold 58px sans-serif'
  ctx.fillText('MOST WANTED', WIDTH / 2, 158)

  ctx.globalAlpha = 0.25
  ctx.strokeStyle = '#f3edf7'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(70, 190)
  ctx.lineTo(WIDTH - 70, 190)
  ctx.stroke()
  ctx.globalAlpha = 1

  ctx.fillStyle = '#7dd3fc'
  ctx.font = '24px sans-serif'
  ctx.fillText(`${operationName} — ${locationName}`, WIDTH / 2, 232)

  ctx.fillStyle = '#ff2e9e'
  ctx.font = 'bold 88px sans-serif'
  ctx.fillText(formatPayout(outcome.payout), WIDTH / 2, 350)
  ctx.fillStyle = 'rgba(243,237,247,0.6)'
  ctx.font = '18px sans-serif'
  ctx.fillText('BOUNTY ON THIS CREW', WIDTH / 2, 382)

  const filled = '★★★★★'.slice(0, outcome.heat)
  const empty = '☆☆☆☆☆'.slice(0, 5 - outcome.heat)
  ctx.font = '46px sans-serif'
  ctx.fillStyle = '#ff2e9e'
  const filledWidth = ctx.measureText(filled).width
  const emptyStart = WIDTH / 2 - (filledWidth + ctx.measureText(empty).width) / 2
  ctx.textAlign = 'left'
  ctx.fillText(filled, emptyStart, 440)
  ctx.fillStyle = 'rgba(243,237,247,0.25)'
  ctx.fillText(empty, emptyStart + filledWidth, 440)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#f3edf7'
  ctx.font = 'bold 30px sans-serif'
  ctx.fillText(outcome.headline.toUpperCase(), WIDTH / 2, 495)

  ctx.textAlign = 'left'
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(243,237,247,0.45)'
  ctx.fillText('CREW ON RECORD', 90, 550)

  let y = 590
  ctx.font = '23px sans-serif'
  crew.forEach((member) => {
    ctx.fillStyle = '#f3edf7'
    ctx.fillText(`${member.icon}  ${member.role} — ${member.name}`, 90, y)
    y += 46
  })

  ctx.textAlign = 'center'
  ctx.font = '15px sans-serif'
  ctx.fillStyle = 'rgba(243,237,247,0.4)'
  ctx.fillText(
    'ARMED AND DANGEROUS · APPROACH WITH CAUTION',
    WIDTH / 2,
    HEIGHT - 55
  )

  return canvas.toDataURL('image/png')
}
