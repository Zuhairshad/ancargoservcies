import { lanes, volumetricDivisor, type Lane, type ServiceMode } from '@/data/rates'

export type QuoteInput = {
  to: string
  mode: ServiceMode
  weightKg: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
}

export type Quote =
  | { kind: 'priced'; chargeableKg: number; volumetricKg: number | null; perKg: number; totalPkr: number; transit: string; lane: Lane }
  | { kind: 'on-request'; chargeableKg: number; volumetricKg: number | null; transit: string; lane: Lane }
  | { kind: 'no-lane' }

export function findLane(to: string, mode: ServiceMode) {
  return lanes.find((l) => l.to === to && l.mode === mode) ?? null
}

/** Chargeable weight is the greater of actual and volumetric weight. */
export function chargeableWeight(input: QuoteInput) {
  const divisor = volumetricDivisor[input.mode]
  const { lengthCm, widthCm, heightCm } = input
  let volumetricKg: number | null = null
  if (divisor && lengthCm && widthCm && heightCm) {
    volumetricKg = Math.round(((lengthCm * widthCm * heightCm) / divisor) * 10) / 10
  }
  const actual = Math.max(0, input.weightKg)
  return { volumetricKg, chargeable: Math.max(actual, volumetricKg ?? 0) }
}

export function getQuote(input: QuoteInput): Quote {
  const lane = findLane(input.to, input.mode)
  if (!lane) return { kind: 'no-lane' }

  const { volumetricKg, chargeable } = chargeableWeight(input)
  const chargeableKg = Math.max(chargeable, lane.minKg)

  if (lane.perKg === null) {
    return { kind: 'on-request', chargeableKg, volumetricKg, transit: lane.transit, lane }
  }
  return {
    kind: 'priced',
    chargeableKg,
    volumetricKg,
    perKg: lane.perKg,
    totalPkr: Math.round(chargeableKg * lane.perKg),
    transit: lane.transit,
    lane,
  }
}

export const pkr = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })

export function formatPkr(amount: number) {
  return `PKR ${pkr.format(amount)}`
}
