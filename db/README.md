# Database setup

The site runs without a database, but booking, tracking, carton labels and the
staff area do not. Without `DATABASE_URL` the app falls back to an in-memory
store, and on Vercel that means a booking created by one request is invisible to
the next — each serverless instance has its own memory. It is not "data is lost
on restart"; it is "the feature does not work".

## 1. Create a database

Any Postgres will do — Vercel Postgres, Neon, Supabase, or your own server.
Copy the connection string it gives you.

## 2. Set the environment variable

Locally, in `.env.local`:

```
DATABASE_URL=postgres://user:password@host:5432/ancs
```

On Vercel: Project → Settings → Environment Variables → add `DATABASE_URL` for
Production, Preview and Development.

Hosted providers require TLS. Make sure the string ends with `?sslmode=require` —
both the app and these scripts look for that and enable TLS when they see it. A
string without it will fail to connect against Neon, Supabase or Vercel Postgres.

## 3. Apply the schema

```
npm run db:migrate
```

Applies every `db/*.sql` in filename order, once each, wrapped in a transaction
and recorded in `schema_migrations`. Running it again is a no-op, and a
migration that fails part way rolls back completely rather than leaving the
schema half-applied.

## 4. Redeploy

Vercel does not pick up a new environment variable until the next deployment.
Trigger one, then confirm the staff area no longer shows the "not persistent"
warning.

## Other commands

| Command | Does |
| --- | --- |
| `npm run db:status` | Row counts per table, and names any table not yet created |
| `npm run db:seed` | Inserts the three sample shipments. Skips any that already exist |
| `npm run db:reset` | **Destroys all data**, then migrates and seeds. Scratch databases only |
| `npm run test:db` | 31 integration checks against a real database. Resets the schema first |

`db:reset` and `test:db` both drop every table. Never point them at production.

## Adding a migration

Add a new numbered file — `003_something.sql` — and run `npm run db:migrate`.
Do not edit a file that has already been applied: it is recorded as done and
will be skipped. If you add a table, add it to the `TABLES` list in
`scripts/db.mjs` so `db:status` reports it and `db:reset` clears it.

## Schema

- **shipments** — one row per booking. Sender and receiver are columns rather
  than JSON so staff can search by name, phone or city later. Money and weight
  are `numeric`, parsed back to numbers at the edge.
- **shipment_events** — the tracking history, cascading on delete.
- **ref_counters** — one row per `YYMM`, holding the last sequence issued that
  month. Allocation locks the row inside the booking transaction, so two
  simultaneous bookings can never receive the same `ANCS-YYMM-NNNN`. The counter
  restarts each month.
- **subscribers** — newsletter addresses, kept apart from customer records.
- **schema_migrations** — which files have been applied.
