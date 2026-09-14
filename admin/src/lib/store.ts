import { formatRef, type GoodsItem, type Shipment, type Status } from './shipments'
import { createPool, PostgresStore } from './postgres-store'

export interface ShipmentStore {
  list(): Promise<Shipment[]>
  get(ref: string): Promise<Shipment | null>
  create(input: NewShipment): Promise<Shipment>
  addEvent(ref: string, status: Status, location?: string, note?: string, at?: string): Promise<Shipment | null>
  updateEvent(ref: string, eventId: number, status: Status, location?: string, note?: string, at?: string): Promise<Shipment | null>
  deleteEvent(ref: string, eventId: number): Promise<Shipment | null>
  confirm(ref: string, freightPkr: number): Promise<Shipment | null>
  updateGoods(ref: string, goods: GoodsItem[], contents: string): Promise<Shipment | null>
  update(ref: string, input: NewShipment): Promise<Shipment | null>
}

export type NewShipment = Omit<Shipment, 'ref' | 'createdAt' | 'status' | 'confirmed' | 'events' | 'freightPkr'>

class MemoryStore implements ShipmentStore {
  private shipments = new Map<string, Shipment>()
  private sequence = 0
  private eventSeq = 0

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
      events: [{ id: ++this.eventSeq, status: 'booked', at: now.toISOString(), location: 'Faisalabad', note: 'Booking received' }],
    }
    this.shipments.set(ref, shipment)
    return shipment
  }

  async addEvent(ref: string, status: Status, location?: string, note?: string, at?: string) {
    const s = this.shipments.get(ref)
    if (!s) return null
    const updated: Shipment = {
      ...s,
      status,
      events: [...s.events, { id: ++this.eventSeq, status, at: at ?? new Date().toISOString(), location, note }],
    }
    this.shipments.set(ref, updated)
    return updated
  }

  async updateEvent(ref: string, eventId: number, status: Status, location?: string, note?: string, at?: string) {
    const s = this.shipments.get(ref)
    if (!s) return null
    const events = s.events.map(e =>
      e.id === eventId ? { ...e, status, location, note, at: at ?? e.at } : e,
    )
    const latest = [...events].sort((a, b) => b.at.localeCompare(a.at))[0]
    const updated: Shipment = { ...s, status: latest?.status ?? s.status, events }
    this.shipments.set(ref, updated)
    return updated
  }

  async deleteEvent(ref: string, eventId: number) {
    const s = this.shipments.get(ref)
    if (!s) return null
    const events = s.events.filter(e => e.id !== eventId)
    const latest = [...events].sort((a, b) => b.at.localeCompare(a.at))[0]
    const updated: Shipment = { ...s, status: latest?.status ?? 'booked', events }
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

  async updateGoods(ref: string, goods: GoodsItem[], contents: string) {
    const s = this.shipments.get(ref)
    if (!s) return null
    const updated: Shipment = { ...s, goods, contents }
    this.shipments.set(ref, updated)
    return updated
  }

  async update(ref: string, input: NewShipment) {
    const s = this.shipments.get(ref)
    if (!s) return null
    const updated: Shipment = { ...s, ...input }
    this.shipments.set(ref, updated)
    return updated
  }
}

const globalForStore = globalThis as unknown as { ancsAdminStore?: ShipmentStore }

function selectStore(): ShipmentStore {
  const url = process.env.DATABASE_URL
  if (url) return new PostgresStore(createPool(url))
  if (process.env.NODE_ENV === 'production') {
    console.warn('[store] DATABASE_URL is not set — running on MemoryStore.')
  }
  return new MemoryStore()
}

export const store: ShipmentStore = globalForStore.ancsAdminStore ?? selectStore()

if (process.env.NODE_ENV !== 'production') globalForStore.ancsAdminStore = store

export const isPersistent = Boolean(process.env.DATABASE_URL)
