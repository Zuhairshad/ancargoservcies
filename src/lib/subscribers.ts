import { createPool } from './postgres-store'

/**
 * Newsletter list. Same shape as the shipment store: Postgres when
 * DATABASE_URL is set, an in-process set otherwise, one interface either way.
 */
export interface SubscriberStore {
  add(email: string, source?: string): Promise<{ added: boolean }>
  count(): Promise<number>
}

class MemorySubscribers implements SubscriberStore {
  private emails = new Set<string>()

  async add(email: string) {
    const key = email.trim().toLowerCase()
    if (this.emails.has(key)) return { added: false }
    this.emails.add(key)
    return { added: true }
  }

  async count() {
    return this.emails.size
  }
}

class PostgresSubscribers implements SubscriberStore {
  private pool: ReturnType<typeof createPool>

  constructor(pool: ReturnType<typeof createPool>) {
    this.pool = pool
  }

  async add(email: string, source = 'website') {
    const result = await this.pool.query(
      `insert into subscribers (email, source) values ($1, $2)
       on conflict (email) do nothing`,
      [email.trim().toLowerCase(), source],
    )
    return { added: result.rowCount === 1 }
  }

  async count() {
    const { rows } = await this.pool.query<{ n: number }>(
      'select count(*)::int as n from subscribers where not unsubscribed',
    )
    return rows[0].n
  }
}

const globalForSubscribers = globalThis as unknown as { ancsSubscribers?: SubscriberStore }

function selectStore(): SubscriberStore {
  const url = process.env.DATABASE_URL
  return url ? new PostgresSubscribers(createPool(url)) : new MemorySubscribers()
}

export const subscribers: SubscriberStore = globalForSubscribers.ancsSubscribers ?? selectStore()

if (process.env.NODE_ENV !== 'production') globalForSubscribers.ancsSubscribers = subscribers
