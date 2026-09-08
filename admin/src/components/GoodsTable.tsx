'use client'

import { useState } from 'react'
import type { GoodsItem } from '@/lib/shipments'

type Row = {
  description: string
  qty: string
  unitValueUsd: string
  totalValueUsd: string
  totalEdited: boolean
}

function empty(): Row {
  return { description: '', qty: '', unitValueUsd: '', totalValueUsd: '', totalEdited: false }
}

function fromItem(g: GoodsItem): Row {
  return {
    description: g.description,
    qty: g.qty > 0 ? String(g.qty) : '',
    unitValueUsd: g.unitValueUsd > 0 ? String(g.unitValueUsd) : '',
    totalValueUsd: g.totalValueUsd > 0 ? String(g.totalValueUsd) : '',
    totalEdited: false,
  }
}

interface Props {
  initialData?: GoodsItem[]
  initialRows?: number
}

export default function GoodsTable({ initialData, initialRows = 5 }: Props) {
  const [rows, setRows] = useState<Row[]>(
    initialData && initialData.length > 0
      ? initialData.map(fromItem)
      : Array.from({ length: initialRows }, empty)
  )

  function update(i: number, key: keyof Row, val: string) {
    setRows(prev => prev.map((r, idx) => {
      if (idx !== i) return r
      const next = { ...r, [key]: val }
      if ((key === 'qty' || key === 'unitValueUsd') && !r.totalEdited) {
        const qty = parseFloat(key === 'qty' ? val : r.qty) || 0
        const usd = parseFloat(key === 'unitValueUsd' ? val : r.unitValueUsd) || 0
        next.totalValueUsd = qty > 0 && usd > 0 ? (qty * usd).toFixed(2) : ''
      }
      if (key === 'totalValueUsd') next.totalEdited = val !== ''
      return next
    }))
  }

  function remove(i: number) {
    if (rows.length <= 1) return
    setRows(prev => prev.filter((_, idx) => idx !== i))
  }

  const grandTotal = rows.reduce((sum, r) => sum + (parseFloat(r.totalValueUsd) || 0), 0)

  return (
    <div>
      <input type="hidden" name="goods_count" value={rows.length} />
      <div style={{ overflowX: 'auto', border: '1px solid #c9d9e2', borderRadius: '4px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--t-small)' }}>
          <thead>
            <tr style={{ background: 'var(--paper)', borderBottom: '2px solid #c9d9e2' }}>
              <th style={th}>Sr. No.</th>
              <th style={{ ...th, width: '45%' }}>Description of Goods</th>
              <th style={th}>No. of Items</th>
              <th style={th}>Unit Value (USD)</th>
              <th style={th}>Total Value</th>
              <th style={{ ...th, width: '2rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #dde8ee' }}>
                <td style={{ ...td, color: 'var(--body-2)', textAlign: 'center', width: '3.5rem' }}>{i + 1}</td>
                <td style={{ ...td, padding: '0.15rem' }}>
                  <input
                    name={`goods_desc_${i}`}
                    value={row.description}
                    onChange={e => update(i, 'description', e.target.value)}
                    style={cell}
                    placeholder="e.g. Wal Paper Roll"
                  />
                </td>
                <td style={{ ...td, padding: '0.15rem', width: '8rem' }}>
                  <input
                    name={`goods_qty_${i}`}
                    value={row.qty}
                    onChange={e => update(i, 'qty', e.target.value)}
                    type="number"
                    min="0"
                    style={{ ...cell, textAlign: 'center' }}
                  />
                </td>
                <td style={{ ...td, padding: '0.15rem', width: '9rem' }}>
                  <input
                    name={`goods_usd_${i}`}
                    value={row.unitValueUsd}
                    onChange={e => update(i, 'unitValueUsd', e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                    style={{ ...cell, textAlign: 'right' }}
                  />
                </td>
                <td style={{ ...td, padding: '0.15rem', width: '9rem' }}>
                  <input
                    name={`goods_total_${i}`}
                    value={row.totalValueUsd}
                    onChange={e => update(i, 'totalValueUsd', e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="auto"
                    style={{ ...cell, textAlign: 'right' }}
                  />
                </td>
                <td style={{ ...td, textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    title="Remove row"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--body-2)', fontSize: '1.2rem', lineHeight: 1, padding: '0 0.3rem' }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {grandTotal > 0 && (
            <tfoot>
              <tr style={{ borderTop: '2px solid #c9d9e2', background: 'var(--paper)' }}>
                <td colSpan={4} style={{ ...td, textAlign: 'right', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--body-2)' }}>
                  Grand Total
                </td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  ${grandTotal.toFixed(2)}
                </td>
                <td style={td} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <button
        type="button"
        className="btn btn--sm btn--outline"
        onClick={() => setRows(r => [...r, empty()])}
        style={{ marginTop: '0.625rem' }}
      >
        + Add row
      </button>
    </div>
  )
}

const th: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  textAlign: 'left',
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--body-2)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '0.35rem 0.75rem',
  verticalAlign: 'middle',
}

const cell: React.CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  padding: '0.3rem 0.4rem',
  font: 'inherit',
  fontSize: 'var(--t-small)',
  color: 'var(--ink)',
}
