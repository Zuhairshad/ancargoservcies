#!/usr/bin/env node
/**
 * Integration test for PostgresStore. Runs against a real database — no mocks.
 *
 *   DATABASE_URL=postgres://… node --experimental-strip-types scripts/test-postgres-store.mjs
 *
 * Destructive: it resets the schema first. Point it at a scratch database.
 */

import { execFileSync } from 'node:child_process'
import pg from 'pg'
import { PostgresStore } from '../src/lib/postgres-store.ts'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

let passed = 0
const failures = []

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1
    console.log(`  ok    ${name}`)
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

console.log('resetting schema…')
execFileSync(process.execPath, ['scripts/db.mjs', 'reset'], { stdio: 'pipe', env: process.env })

const pool = new pg.Pool({ connectionString: url })
const store = new PostgresStore(pool)

try {
  console.log('\nreads')
  const all = await store.list()
  check('list() returns the three seeded shipments', all.length === 3, `got ${all.length}`)
  check(
    'list() is newest first',
    all[0].createdAt > all[1].createdAt && all[1].createdAt > all[2].createdAt,
    all.map((s) => s.ref).join(' > '),
  )
  check('list() attaches events to the right shipment', all.find((s) => s.ref === 'ANCS-2607-0148')?.events.length === 5)

  const one = await store.get('ANCS-2607-0148')
  check('get() finds a shipment', one !== null)
  check('get() parses numeric columns as numbers', typeof one.weightKg === 'number' && one.weightKg === 24, String(one.weightKg))
  check('get() keeps fractional weights exact', (await store.get('ANCS-2607-0149')).weightKg === 6.5)
  check('get() parses money as numbers', one.freightPkr === 13200 && one.declaredValuePkr === 85000)
  check(
    'get() returns events in chronological order',
    one.events.map((e) => e.status).join(',') === 'booked,collected,at-hub,departed,in-transit',
  )
  check('get() maps nested sender/receiver', one.sender.city === 'Faisalabad' && one.receiver.country === 'United Kingdom')
  check('get() normalises pickup_date to YYYY-MM-DD', one.pickupDate === '2026-07-18', String(one.pickupDate))
  check('get() turns null email into undefined', one.sender.email === undefined)
  check('get() returns null for an unknown ref', (await store.get('ANCS-9999-9999')) === null)

  console.log('\nwrites')
  const created = await store.create({
    sender: { name: 'Test Sender', phone: '+92 300 0000000', address: '1 Test Road', city: 'Faisalabad', country: 'Pakistan' },
    receiver: {
      name: 'Test Receiver',
      phone: '+44 7700 000000',
      email: 'r@example.com',
      address: '2 Test Street',
      city: 'Leeds LS1',
      country: 'United Kingdom',
    },
    mode: 'sea-lcl',
    pieces: 2,
    weightKg: 12.5,
    contents: 'Test contents',
    declaredValuePkr: 40000,
    estimatePkr: 6875,
    pickupDate: '2026-08-01',
  })
  check('create() issues the next reference in sequence', created.ref === 'ANCS-2607-0151', created.ref)
  check('create() starts as booked and unconfirmed', created.status === 'booked' && created.confirmed === false)
  check('create() writes an opening event', created.events.length === 1 && created.events[0].status === 'booked')
  check('create() keeps the estimate', created.estimatePkr === 6875)
  check('create() leaves freight unset', created.freightPkr === null)
  check('create() persists the optional email', created.receiver.email === 'r@example.com')
  check('create() is readable back', (await store.get(created.ref))?.contents === 'Test contents')

  const confirmed = await store.confirm(created.ref, 6900)
  check('confirm() sets the freight charge', confirmed.freightPkr === 6900 && confirmed.confirmed === true)
  check('confirm() returns null for an unknown ref', (await store.confirm('ANCS-9999-9999', 1)) === null)

  const moved = await store.addEvent(created.ref, 'collected', 'Faisalabad', 'Picked up')
  check('addEvent() advances the status', moved.status === 'collected')
  check('addEvent() appends to history', moved.events.length === 2 && moved.events[1].note === 'Picked up')
  const moved2 = await store.addEvent(created.ref, 'at-hub')
  check('addEvent() accepts a bare status', moved2.events.length === 3 && moved2.events[2].location === undefined)
  check('addEvent() returns null for an unknown ref', (await store.addEvent('ANCS-9999-9999', 'collected')) === null)

  console.log('\nconcurrency — the reason ref allocation holds a row lock')
  const parallel = await Promise.all(
    Array.from({ length: 12 }, (_, i) =>
      store.create({
        sender: { name: `Bulk ${i}`, phone: '+92 300 1111111', address: 'Road', city: 'Faisalabad', country: 'Pakistan' },
        receiver: { name: `Bulk ${i}`, phone: '+44 7700 111111', address: 'Street', city: 'London', country: 'United Kingdom' },
        mode: 'air-cargo',
        pieces: 1,
        weightKg: 3,
        contents: 'Docs',
        declaredValuePkr: 1000,
        estimatePkr: null,
      }),
    ),
  )
  const refs = parallel.map((s) => s.ref)
  const seqs = refs.map((r) => Number(r.split('-')[2])).sort((a, b) => a - b)
  check('12 simultaneous bookings get 12 distinct references', new Set(refs).size === 12, refs.join(' '))
  check(
    'references stay contiguous',
    seqs.join(',') === Array.from({ length: 12 }, (_, i) => 152 + i).join(','),
    seqs.join(','),
  )
  const afterBulk = await store.list()
  check('all 12 are persisted', afterBulk.length === 16, String(afterBulk.length))

  console.log('\nreferential integrity')
  await pool.query('delete from shipments where ref = $1', [created.ref])
  const orphans = await pool.query('select count(*)::int as n from shipment_events where ref = $1', [created.ref])
  check('deleting a shipment cascades to its events', orphans.rows[0].n === 0, `${orphans.rows[0].n} left`)

  let rejected = false
  try {
    await pool.query('insert into shipment_events (ref, status) values ($1, $2)', ['ANCS-0000-0000', 'booked'])
  } catch {
    rejected = true
  }
  check('events cannot reference a missing shipment', rejected)

  let badPieces = false
  try {
    await pool.query(
      `insert into shipments (ref, status, sender_name, sender_phone, sender_address, sender_city, sender_country,
        receiver_name, receiver_phone, receiver_address, receiver_city, receiver_country, mode, pieces, weight_kg, contents)
       values ('ANCS-0000-0001','booked','a','b','c','d','e','f','g','h','i','j','sea-lcl',0,1,'x')`,
    )
  } catch {
    badPieces = true
  }
  check('pieces must be at least 1', badPieces)
} finally {
  await pool.end()
}

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length) {
  console.log('\nfailures:')
  failures.forEach((f) => console.log(`  - ${f}`))
  process.exitCode = 1
}
