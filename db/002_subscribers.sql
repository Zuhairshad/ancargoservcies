-- Newsletter subscribers. Kept separate from shipments: an address here is a
-- marketing contact, not a customer record.

create table if not exists subscribers (
  email        text        primary key,
  created_at   timestamptz not null default now(),
  unsubscribed boolean     not null default false,
  source       text        not null default 'website'
);

create index if not exists subscribers_created_at_idx on subscribers (created_at desc);
