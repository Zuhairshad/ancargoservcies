export type ServiceMode = 'sea-lcl' | 'sea-fcl' | 'air-cargo' | 'courier' | 'door-to-door'

export const modeLabels: Record<ServiceMode, string> = {
  'sea-lcl': 'Sea — LCL (shared container)',
  'sea-fcl': 'Sea — FCL (full container)',
  'air-cargo': 'Air cargo',
  courier: 'Courier',
  'door-to-door': 'Door-to-door',
}

export type Lane = {
  from: string
  to: string
  mode: ServiceMode
  /** Rate per kg in PKR. null means "quote on request" — no published rate yet. */
  perKg: number | null
  /** Chargeable minimum in kg. */
  minKg: number
  transit: string
  notes?: string
}

/**
 * The only rate published on the current site is PKR 550/kg for UK sea freight.
 * Everything else is deliberately null until ANCS supplies the real figures —
 * the calculator shows "quote on request" rather than inventing a number.
 * Volumetric rule: chargeable weight = max(actual kg, L×W×H cm / divisor).
 */
export const volumetricDivisor: Record<ServiceMode, number | null> = {
  'sea-lcl': 6000,
  'sea-fcl': null,
  'air-cargo': 6000,
  courier: 5000,
  'door-to-door': 6000,
}

export const lanes: Lane[] = [
  { from: 'Pakistan', to: 'United Kingdom', mode: 'sea-lcl', perKg: 550, minKg: 10, transit: '22–28 days', notes: 'Warehousing and clearance included. Delivered to warehouse or door.' },
  { from: 'Pakistan', to: 'United Kingdom', mode: 'air-cargo', perKg: null, minKg: 5, transit: '5–8 days' },
  { from: 'Pakistan', to: 'United Kingdom', mode: 'door-to-door', perKg: null, minKg: 5, transit: '25–32 days' },
  { from: 'Pakistan', to: 'United Arab Emirates', mode: 'door-to-door', perKg: null, minKg: 5, transit: '7–12 days' },
  { from: 'Pakistan', to: 'United Arab Emirates', mode: 'air-cargo', perKg: null, minKg: 5, transit: '3–5 days' },
  { from: 'Pakistan', to: 'Saudi Arabia', mode: 'door-to-door', perKg: null, minKg: 5, transit: '8–14 days' },
  { from: 'Pakistan', to: 'Europe', mode: 'sea-lcl', perKg: null, minKg: 10, transit: '28–35 days' },
  { from: 'Pakistan', to: 'Europe', mode: 'air-cargo', perKg: null, minKg: 5, transit: '6–9 days' },
  { from: 'Pakistan', to: 'United States', mode: 'sea-lcl', perKg: null, minKg: 10, transit: '35–45 days' },
  { from: 'Pakistan', to: 'Rest of world', mode: 'courier', perKg: null, minKg: 1, transit: '5–10 days' },
]

export const destinations = [...new Set(lanes.map((l) => l.to))]

export const plans = [
  {
    name: 'Warehousing & Sea Freight',
    blurb: 'For commercial shippers moving regular volume to the UK.',
    price: 'PKR 550',
    unit: '/ kg',
    features: ['Warehousing while cargo waits for the sailing', 'Customs clearance both ends', 'Contractual month-wise rates', 'Delivery to warehouse', '10 kg chargeable minimum'],
  },
  {
    name: 'Door-to-Door & Consolidation',
    blurb: 'For families and small businesses sending to the UK, Gulf and Europe.',
    price: 'On request',
    unit: '',
    features: ['Collection from your address', 'Packing included', 'Air and sea options', 'Consolidation to cut freight cost', 'Delivery to the recipient’s door'],
    featured: true,
  },
  {
    name: 'Courier & Easy Ship',
    blurb: 'For single parcels, documents and anything urgent.',
    price: 'On request',
    unit: '',
    features: ['Weekly movements', 'DHL, FedEx, UPS and Aramex', 'Tracked and signed for', 'Documents and money orders', 'No minimum weight'],
  },
]
