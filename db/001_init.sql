-- AN Cargo Services — initial schema
-- Apply with:  psql "$DATABASE_URL" -f db/001_init.sql
-- Safe to re-run: every statement is guarded.

create table if not exists shipments (
  ref                text        primary key,
  created_at         timestamptz not null default now(),
  status             text        not null,
  confirmed          boolean     not null default false,

  -- Sender and receiver are stored as columns rather than JSON so staff can
  -- search by name, phone or city once the admin list grows a search box.
  sender_name        text        not null,
  sender_phone       text        not null,
  sender_email       text,
  sender_address     text        not null,
  sender_city        text        not null,
  sender_country     text        not null default 'Pakistan',

  receiver_name      text        not null,
  receiver_phone     text        not null,
  receiver_email     text,
  receiver_address   text        not null,
  receiver_city      text        not null,
  receiver_country   text        not null,

  mode               text        not null,
  pieces             integer     not null check (pieces >= 1),
  weight_kg          numeric(10, 2) not null check (weight_kg > 0),
  contents           text        not null,
  declared_value_pkr numeric(12, 2) not null default 0,

  -- Estimate is what the calculator showed the customer; freight is what staff
  -- set after weighing. Null freight means "not yet confirmed".
  estimate_pkr       numeric(12, 2),
  freight_pkr        numeric(12, 2),
  pickup_date        date
);

create index if not exists shipments_created_at_idx on shipments (created_at desc);
create index if not exists shipments_status_idx on shipments (status);
create index if not exists shipments_receiver_phone_idx on shipments (receiver_phone);

create table if not exists shipment_events (
  id       bigserial   primary key,
  ref      text        not null references shipments (ref) on delete cascade,
  status   text        not null,
  at       timestamptz not null default now(),
  location text,
  note     text
);

create index if not exists shipment_events_ref_at_idx on shipment_events (ref, at, id);

-- One row per YYMM period, holding the last sequence number issued that month.
-- Reference allocation locks this row so two simultaneous bookings can never
-- receive the same ANCS-YYMM-NNNN.
create table if not exists ref_counters (
  period   text    primary key,
  last_seq integer not null default 0
);
