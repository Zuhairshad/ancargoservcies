'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { destinations, modeLabels, type ServiceMode } from '@/data/rates'
import { getQuote, formatPkr } from '@/lib/quote'
import { site, whatsappLink } from '@/data/site'

const modes: ServiceMode[] = ['sea-lcl', 'sea-fcl', 'air-cargo', 'courier', 'door-to-door']

export default function QuoteCalculator() {
  const [to, setTo] = useState(destinations[0])
  const [mode, setMode] = useState<ServiceMode>('sea-lcl')
  const [weight, setWeight] = useState('24')
  const [dims, setDims] = useState({ l: '', w: '', h: '' })
  const [submitted, setSubmitted] = useState(false)

  const quote = useMemo(
    () =>
      getQuote({
        to,
        mode,
        weightKg: Number(weight) || 0,
        lengthCm: Number(dims.l) || undefined,
        widthCm: Number(dims.w) || undefined,
        heightCm: Number(dims.h) || undefined,
      }),
    [to, mode, weight, dims],
  )

  return (
    <div className="tool">
      <form
        className="tool__grid"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        <div className="field">
          <label htmlFor="q-to">Destination</label>
          <select id="q-to" value={to} onChange={(e) => setTo(e.target.value)}>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="q-mode">Service</label>
          <select id="q-mode" value={mode} onChange={(e) => setMode(e.target.value as ServiceMode)}>
            {modes.map((m) => (
              <option key={m} value={m}>
                {modeLabels[m]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="q-weight">Weight (kg)</label>
          <input
            id="q-weight"
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="q-l">Size L×W×H (cm, optional)</label>
          <div className="row" style={{ gap: '0.4rem', flexWrap: 'nowrap' }}>
            <input id="q-l" type="number" min="0" placeholder="L" value={dims.l} onChange={(e) => setDims({ ...dims, l: e.target.value })} />
            <input type="number" min="0" placeholder="W" aria-label="Width in cm" value={dims.w} onChange={(e) => setDims({ ...dims, w: e.target.value })} />
            <input type="number" min="0" placeholder="H" aria-label="Height in cm" value={dims.h} onChange={(e) => setDims({ ...dims, h: e.target.value })} />
          </div>
        </div>

        <button className="btn" type="submit">
          Calculate
        </button>
      </form>

      <div aria-live="polite">
        {quote.kind === 'priced' && (
          <div className="tool__result">
            <b>{formatPkr(quote.totalPkr)}</b>
            <span>
              estimated freight · {quote.chargeableKg} kg chargeable at {formatPkr(quote.perKg)}/kg · {quote.transit}
            </span>
          </div>
        )}
        {quote.kind === 'on-request' && (
          <div className="tool__result">
            <b>Quote on request</b>
            <span>
              {quote.chargeableKg} kg chargeable · {quote.transit} · we do not publish a rate for this lane yet
            </span>
          </div>
        )}
        {quote.kind === 'no-lane' && (
          <div className="tool__result">
            <b>Ask us</b>
            <span>We do not have a published rate for that combination — send us the details and we will quote it.</span>
          </div>
        )}
      </div>

      {quote.kind !== 'no-lane' && quote.volumetricKg !== null && (
        <p className="tool__note">
          Volumetric weight works out at {quote.volumetricKg} kg. Freight is charged on whichever is greater, actual or
          volumetric.
        </p>
      )}

      <p className="tool__note">
        Estimates only, subject to weighing at our facility. Duties and taxes charged at the destination are not
        included.
      </p>

      <div className="row">
        <Link className="btn btn--sm" href="/book">
          Book this shipment
        </Link>
        <a
          className="btn btn--sm btn--outline"
          href={whatsappLink(
            `Hello ${site.shortName}, I would like a quote: ${weight} kg to ${to} by ${modeLabels[mode]}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Send on WhatsApp
        </a>
        {submitted && <span className="tool__note">Estimate updates as you type — no need to press Calculate.</span>}
      </div>
    </div>
  )
}
