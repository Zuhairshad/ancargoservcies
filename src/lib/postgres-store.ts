import { Pool, type PoolClient } from 'pg'
import { formatRef, type Shipment, type ShipmentEvent, type Status } from './shipments'
import type { NewShipment, ShipmentStore } from './store'
import type { ServiceMode } from '@/data/rates'

/**
 * Postgres implementation of ShipmentStore. Schema lives in db/001_init.sql.
 *
 * Same interface as MemoryStore, so pages and components are unchanged — the
 * only thing that decides which one runs is whether DATABASE_URL is set.
 */

type Row = {
  ref: string
  created_at: Date
  status: Status
  confirmed: boolean
  sender_name: string
  sender_phone: string
  sender_email: string | null
  sender_address: string
  sender_city: string
  sender_country: string
  receiver_name: string
  receiver_phone: string
  receiver_email: string | null
  receiver_address: string
  receiver_city: string
  receiver_country: string
  mode: ServiceMode
  pieces: number
  weight_kg: string
  contents: string
  declared_value_pkr: string
  estimate_pkr: string | null
  freight_pkr: string | null
  pickup_date: Date | null
}

type EventRow = { status: Status; at: Date; location: string | null; note: string | null }

/** numeric comes back from pg as a string to avoid float rounding — parse at the edge. */
const num = (v: string | null): number | null => (v === null ? null : Number(v))

function toShipment(row: Row, events: EventRow[]): Shipment {
  return {
    ref: row.ref,
    createdAt: row.created_at.toISOString(),
    status: row.status,
    confirmed: row.confirmed,
    sender: {
      name: row.sender_name,
      phone: row.sender_phone,
      email: row.sender_email ?? undefined,
      address: row.sender_address,
      city: row.sender_city,
      country: row.sender_country,
    },
    receiver: {
      name: row.receiver_name,
      phone: row.receiver_phone,
      email: row.receiver_email ?? undefined,
      address: row.receiver_address,
      city: row.receiver_city,
      country: row.receiver_country,
    },
    mode: row.mode,
    pieces: row.pieces,
    weightKg: Number(row.weight_kg),
    contents: row.contents,
    declaredValuePkr: Number(row.declared_value_pkr),
    estimatePkr: num(row.estimate_pkr),
    freightPkr: num(row.freight_pkr),
    pickupDate: row.pickup_date ? row.pickup_date.toISOString().slice(0, 10) : undefined,
    events: events.map(
      (e): ShipmentEvent => ({
        status: e.status,
        at: e.at.toISOString(),
        location: e.location ?? undefined,
        note: e.note ?? undefined,
      }),
    ),
  }
}

const SELECT_EVENTS = 'select status, at, location, note from shipment_events where ref = $1 order by at asc, id asc'

export class PostgresStore implements ShipmentStore {
  private pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  private async withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect()
    try {
      await client.query('begin')
      const result = await fn(client)
      await client.query('commit')
      return result
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }

  async list(): Promise<Shipment[]> {
    const { rows } = await this.pool.query<Row>('select * from shipments order by created_at desc')
    const events = await this.pool.query<EventRow & { ref: string }>(
      'select ref, status, at, location, note from shipment_events order by at asc, id asc',
    )
    const byRef = new Map<string, EventRow[]>()
    for (const e of events.rows) {
      const list = byRef.get(e.ref) ?? []
      list.push(e)
      byRef.set(e.ref, list)
    }
    return rows.map((row) => toShipment(row, byRef.get(row.ref) ?? []))
  }

  async get(ref: string): Promise<Shipment | null> {
    const { rows } = await this.pool.query<Row>('select * from shipments where ref = $1', [ref])
    if (rows.length === 0) return null
    const events = await this.pool.query<EventRow>(SELECT_EVENTS, [ref])
    return toShipment(rows[0], events.rows)
  }

  async create(input: NewShipment): Promise<Shipment> {
    return this.withTransaction(async (client) => {
      const now = new Date()

      // Global counter — 'AN' is the constant key so all bookings share one sequence.
      const counter = await client.query<{ last_seq: number }>(
        `insert into ref_counters (period, last_seq) values ('AN', 1)
         on conflict (period) do update set last_seq = ref_counters.last_seq + 1
         returning last_seq`,
      )
      const ref = formatRef(now, counter.rows[0].last_seq)

      await client.query(
        `insert into shipments (
           ref, created_at, status, confirmed,
           sender_name, sender_phone, sender_email, sender_address, sender_city, sender_country,
           receiver_name, receiver_phone, receiver_email, receiver_address, receiver_city, receiver_country,
           mode, pieces, weight_kg, contents, declared_value_pkr, estimate_pkr, freight_pkr, pickup_date
         ) values (
           $1, $2, 'booked', false,
           $3, $4, $5, $6, $7, $8,
           $9, $10, $11, $12, $13, $14,
           $15, $16, $17, $18, $19, $20, null, $21
         )`,
        [
          ref,
          now,
          input.sender.name,
          input.sender.phone,
          input.sender.email ?? null,
          input.sender.address,
          input.sender.city,
          input.sender.country,
          input.receiver.name,
          input.receiver.phone,
          input.receiver.email ?? null,
          input.receiver.address,
          input.receiver.city,
          input.receiver.country,
          input.mode,
          input.pieces,
          input.weightKg,
          input.contents,
          input.declaredValuePkr,
          input.estimatePkr,
          input.pickupDate ?? null,
        ],
      )

      await client.query(
        `insert into shipment_events (ref, status, at, location, note)
         values ($1, 'booked', $2, $3, $4)`,
        [ref, now, 'Faisalabad', 'Booking received'],
      )

      const { rows } = await client.query<Row>('select * from shipments where ref = $1', [ref])
      const events = await client.query<EventRow>(SELECT_EVENTS, [ref])
      return toShipment(rows[0], events.rows)
    })
  }

  async addEvent(ref: string, status: Status, location?: string, note?: string): Promise<Shipment | null> {
    return this.withTransaction(async (client) => {
      const updated = await client.query('update shipments set status = $2 where ref = $1', [ref, status])
      if (updated.rowCount === 0) return null

      await client.query(
        `insert into shipment_events (ref, status, at, location, note) values ($1, $2, now(), $3, $4)`,
        [ref, status, location ?? null, note ?? null],
      )

      const { rows } = await client.query<Row>('select * from shipments where ref = $1', [ref])
      const events = await client.query<EventRow>(SELECT_EVENTS, [ref])
      return toShipment(rows[0], events.rows)
    })
  }

  async confirm(ref: string, freightPkr: number): Promise<Shipment | null> {
    const updated = await this.pool.query('update shipments set confirmed = true, freight_pkr = $2 where ref = $1', [
      ref,
      freightPkr,
    ])
    if (updated.rowCount === 0) return null
    return this.get(ref)
  }
}

/** Reused across hot reloads so development does not exhaust connections. */
const globalForPool = globalThis as unknown as { ancsPool?: Pool }

export function createPool(connectionString: string) {
  const pool =
    globalForPool.ancsPool ??
    new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      // Managed Postgres (Supabase, Neon, RDS) terminates TLS with its own CA.
      ssl: /sslmode=(require|verify)/.test(connectionString) ? { rejectUnauthorized: false } : undefined,
    })
  if (process.env.NODE_ENV !== 'production') globalForPool.ancsPool = pool
  return pool
}
