#!/usr/bin/env node
/**
 * Database tasks. Requires DATABASE_URL.
 *
 *   node scripts/db.mjs migrate   apply db/*.sql in filename order
 *   node scripts/db.mjs seed      insert the three sample shipments (skips any that exist)
 *   node scripts/db.mjs reset     drop the tables, migrate, seed
 *   node scripts/db.mjs status    show table and row counts
 */

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const url = process.env.DATABASE_URL

if (!url) {
  console.error('DATABASE_URL is not set. Example:\n  DATABASE_URL=postgres://user:pass@host:5432/ancs node scripts/db.mjs migrate')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: url,
  ssl: /sslmode=(require|verify)/.test(url) ? { rejectUnauthorized: false } : undefined,
})

async function migrate() {
  const dir = path.join(root, 'db')
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
  for (const file of files) {
    process.stdout.write(`  applying ${file} … `)
    await pool.query(readFileSync(path.join(dir, file), 'utf8'))
    console.log('ok')
  }
}

async function drop() {
  await pool.query('drop table if exists shipment_events, shipments, ref_counters cascade')
  console.log('  tables dropped')
}

/**
 * Sample shipments, kept in step with the MemoryStore seed. Inserted with
 * explicit refs, and ref_counters is advanced so the next real booking does not
 * collide with them.
 */
const day = 86_400_000
const at = (offsetDays) => new Date(Date.UTC(2026, 6, 28) - offsetDays * day)

const samples = [
  {
    ref: 'ANCS-2607-0148', createdAt: at(11), status: 'in-transit', confirmed: true,
    sender: ['Bilal Ahmed', '+92 300 1234567', null, '112 Susan Road, Madina Town', 'Faisalabad', 'Pakistan'],
    receiver: ['M. Rashid', '+44 7700 900123', null, '14 Wilmslow Road', 'Manchester M14 5TQ', 'United Kingdom'],
    mode: 'sea-lcl', pieces: 3, weightKg: 24, contents: 'Household items, clothing, gifts',
    declared: 85000, estimate: 13200, freight: 13200, pickup: '2026-07-18',
    events: [
      ['booked', at(11), 'Faisalabad', 'Booking received'],
      ['collected', at(10), 'Faisalabad', 'Collected from sender'],
      ['at-hub', at(9), 'Faisalabad hub', 'Packed and consolidated'],
      ['departed', at(6), 'Port Qasim, Karachi', 'Loaded and sailed'],
      ['in-transit', at(4), 'At sea', 'ETA Felixstowe 12 Aug'],
    ],
  },
  {
    ref: 'ANCS-2607-0149', createdAt: at(5), status: 'delivered', confirmed: true,
    sender: ['Ayesha Malik', '+92 321 7654321', null, 'Gulberg III', 'Lahore', 'Pakistan'],
    receiver: ['Omar Farooq', '+971 50 123 4567', null, 'Al Barsha 1', 'Dubai', 'United Arab Emirates'],
    mode: 'air-cargo', pieces: 1, weightKg: 6.5, contents: 'Documents and gifts',
    declared: 30000, estimate: null, freight: 9800, pickup: '2026-07-23',
    events: [
      ['booked', at(5), 'Lahore', null],
      ['collected', at(5), 'Lahore', null],
      ['departed', at(4), 'Lahore airport', null],
      ['customs', at(3), 'Dubai', null],
      ['out-for-delivery', at(2), 'Dubai', null],
      ['delivered', at(2), 'Dubai', 'Signed for by recipient'],
    ],
  },
  {
    ref: 'ANCS-2607-0150', createdAt: at(1), status: 'booked', confirmed: false,
    sender: ['Imran Sheikh', '+92 333 2223344', null, 'Saddar', 'Karachi', 'Pakistan'],
    receiver: ['Fatima Noor', '+966 55 987 6543', null, 'Al Olaya', 'Riyadh', 'Saudi Arabia'],
    mode: 'door-to-door', pieces: 2, weightKg: 18, contents: 'Clothing, dry foodstuffs, household items',
    declared: 60000, estimate: null, freight: null, pickup: null,
    events: [['booked', at(1), 'Karachi', 'Awaiting collection']],
  },
]

async function seed() {
  for (const s of samples) {
    const inserted = await pool.query(
      `insert into shipments (
         ref, created_at, status, confirmed,
         sender_name, sender_phone, sender_email, sender_address, sender_city, sender_country,
         receiver_name, receiver_phone, receiver_email, receiver_address, receiver_city, receiver_country,
         mode, pieces, weight_kg, contents, declared_value_pkr, estimate_pkr, freight_pkr, pickup_date
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
       on conflict (ref) do nothing`,
      [s.ref, s.createdAt, s.status, s.confirmed, ...s.sender, ...s.receiver,
       s.mode, s.pieces, s.weightKg, s.contents, s.declared, s.estimate, s.freight, s.pickup],
    )
    if (inserted.rowCount === 0) {
      console.log(`  ${s.ref} already present, skipped`)
      continue
    }
    for (const [status, when, location, note] of s.events) {
      await pool.query(
        'insert into shipment_events (ref, status, at, location, note) values ($1,$2,$3,$4,$5)',
        [s.ref, status, when, location, note],
      )
    }
    console.log(`  ${s.ref} inserted with ${s.events.length} events`)
  }

  // Keep the counter ahead of the seeded refs.
  const highest = samples.reduce((max, s) => Math.max(max, Number(s.ref.split('-')[2])), 0)
  await pool.query(
    `insert into ref_counters (period, last_seq) values ('2607', $1)
     on conflict (period) do update set last_seq = greatest(ref_counters.last_seq, $1)`,
    [highest],
  )
  console.log(`  ref_counters period 2607 set to at least ${highest}`)
}

async function status() {
  const { rows } = await pool.query(`
    select 'shipments' as table, count(*)::int as rows from shipments
    union all select 'shipment_events', count(*)::int from shipment_events
    union all select 'ref_counters', count(*)::int from ref_counters
    order by 1`)
  for (const r of rows) console.log(`  ${r.table.padEnd(16)} ${r.rows}`)
}

const task = process.argv[2] ?? 'status'
try {
  if (task === 'migrate') await migrate()
  else if (task === 'seed') await seed()
  else if (task === 'reset') { await drop(); await migrate(); await seed() }
  else if (task === 'status') await status()
  else { console.error(`Unknown task "${task}". Use migrate, seed, reset or status.`); process.exitCode = 1 }
} catch (error) {
  console.error('failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
