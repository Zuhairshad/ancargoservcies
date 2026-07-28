import { formatRef, type Shipment, type Status } from './shipments'

/**
 * Data layer. Everything the app does goes through this interface, so Phase 3
 * swaps MemoryStore for a Postgres implementation without touching a page or a
 * component.
 *
 * MemoryStore holds shipments for the lifetime of the server process: reads and
 * writes work, but nothing survives a restart or spans multiple instances. It is
 * here so the booking flow, admin screens, labels and tracking can be built and
 * demonstrated before the database exists — not as a production store.
 */
export interface ShipmentStore {
  list(): Promise<Shipment[]>
  get(ref: string): Promise<Shipment | null>
  create(input: NewShipment): Promise<Shipment>
  addEvent(ref: string, status: Status, location?: string, note?: string): Promise<Shipment | null>
  confirm(ref: string, freightPkr: number): Promise<Shipment | null>
}

export type NewShipment = Omit<
  Shipment,
  'ref' | 'createdAt' | 'status' | 'confirmed' | 'events' | 'freightPkr'
>

class MemoryStore implements ShipmentStore {
  private shipments = new Map<string, Shipment>()
  private sequence = 0

  constructor(seed: Shipment[] = []) {
    for (const s of seed) {
      this.shipments.set(s.ref, s)
      const n = Number(s.ref.split('-')[2])
      if (Number.isFinite(n)) this.sequence = Math.max(this.sequence, n)
    }
  }

  async list() {
    return [...this.shipments.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async get(ref: string) {
    return this.shipments.get(ref) ?? null
  }

  async create(input: NewShipment) {
    const now = new Date()
    this.sequence += 1
    const ref = formatRef(now, this.sequence)
    const shipment: Shipment = {
      ...input,
      ref,
      createdAt: now.toISOString(),
      status: 'booked',
      confirmed: false,
      freightPkr: null,
      events: [{ status: 'booked', at: now.toISOString(), location: 'Faisalabad', note: 'Booking received' }],
    }
    this.shipments.set(ref, shipment)
    return shipment
  }

  async addEvent(ref: string, status: Status, location?: string, note?: string) {
    const s = this.shipments.get(ref)
    if (!s) return null
    const updated: Shipment = {
      ...s,
      status,
      events: [...s.events, { status, at: new Date().toISOString(), location, note }],
    }
    this.shipments.set(ref, updated)
    return updated
  }

  async confirm(ref: string, freightPkr: number) {
    const s = this.shipments.get(ref)
    if (!s) return null
    const updated: Shipment = { ...s, confirmed: true, freightPkr }
    this.shipments.set(ref, updated)
    return updated
  }
}

const day = 86_400_000
const iso = (offsetDays: number) => new Date(Date.UTC(2026, 6, 28) - offsetDays * day).toISOString()

const seed: Shipment[] = [
  {
    ref: 'ANCS-2607-0148',
    createdAt: iso(11),
    status: 'in-transit',
    confirmed: true,
    sender: {
      name: 'Bilal Ahmed',
      phone: '+92 300 1234567',
      address: '112 Susan Road, Madina Town',
      city: 'Faisalabad',
      country: 'Pakistan',
    },
    receiver: {
      name: 'M. Rashid',
      phone: '+44 7700 900123',
      address: '14 Wilmslow Road',
      city: 'Manchester M14 5TQ',
      country: 'United Kingdom',
    },
    mode: 'sea-lcl',
    pieces: 3,
    weightKg: 24,
    contents: 'Household items, clothing, gifts',
    declaredValuePkr: 85_000,
    estimatePkr: 13_200,
    freightPkr: 13_200,
    pickupDate: '2026-07-18',
    events: [
      { status: 'booked', at: iso(11), location: 'Faisalabad', note: 'Booking received' },
      { status: 'collected', at: iso(10), location: 'Faisalabad', note: 'Collected from sender' },
      { status: 'at-hub', at: iso(9), location: 'Faisalabad hub', note: 'Packed and consolidated' },
      { status: 'departed', at: iso(6), location: 'Port Qasim, Karachi', note: 'Loaded and sailed' },
      { status: 'in-transit', at: iso(4), location: 'At sea', note: 'ETA Felixstowe 12 Aug' },
    ],
  },
  {
    ref: 'ANCS-2607-0149',
    createdAt: iso(5),
    status: 'delivered',
    confirmed: true,
    sender: {
      name: 'Ayesha Malik',
      phone: '+92 321 7654321',
      address: 'Gulberg III',
      city: 'Lahore',
      country: 'Pakistan',
    },
    receiver: {
      name: 'Omar Farooq',
      phone: '+971 50 123 4567',
      address: 'Al Barsha 1',
      city: 'Dubai',
      country: 'United Arab Emirates',
    },
    mode: 'air-cargo',
    pieces: 1,
    weightKg: 6.5,
    contents: 'Documents and gifts',
    declaredValuePkr: 30_000,
    estimatePkr: null,
    freightPkr: 9_800,
    pickupDate: '2026-07-23',
    events: [
      { status: 'booked', at: iso(5), location: 'Lahore' },
      { status: 'collected', at: iso(5), location: 'Lahore' },
      { status: 'departed', at: iso(4), location: 'Lahore airport' },
      { status: 'customs', at: iso(3), location: 'Dubai' },
      { status: 'out-for-delivery', at: iso(2), location: 'Dubai' },
      { status: 'delivered', at: iso(2), location: 'Dubai', note: 'Signed for by recipient' },
    ],
  },
  {
    ref: 'ANCS-2607-0150',
    createdAt: iso(1),
    status: 'booked',
    confirmed: false,
    sender: {
      name: 'Imran Sheikh',
      phone: '+92 333 2223344',
      address: 'Saddar',
      city: 'Karachi',
      country: 'Pakistan',
    },
    receiver: {
      name: 'Fatima Noor',
      phone: '+966 55 987 6543',
      address: 'Al Olaya',
      city: 'Riyadh',
      country: 'Saudi Arabia',
    },
    mode: 'door-to-door',
    pieces: 2,
    weightKg: 18,
    contents: 'Clothing, dry foodstuffs, household items',
    declaredValuePkr: 60_000,
    estimatePkr: null,
    freightPkr: null,
    events: [{ status: 'booked', at: iso(1), location: 'Karachi', note: 'Awaiting collection' }],
  },
]

/**
 * Reused across hot reloads in development so bookings made while developing do
 * not disappear on every file save.
 */
const globalForStore = globalThis as unknown as { ancsStore?: ShipmentStore }

export const store: ShipmentStore = globalForStore.ancsStore ?? new MemoryStore(seed)

if (process.env.NODE_ENV !== 'production') globalForStore.ancsStore = store
