'use client'

import { useState, useTransition } from 'react'
import type { GoodsItem } from '@/lib/shipments'
import { updateGoods } from '@/actions'
import GoodsTable from './GoodsTable'

interface Props {
  ref_: string
  goods: GoodsItem[] | null
}

export default function GoodsSection({ ref_, goods }: Props) {
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const count = parseInt(String(form.get('goods_count') || '0'), 10)
    const items: GoodsItem[] = []
    for (let i = 0; i < count; i++) {
      const description = String(form.get(`goods_desc_${i}`) || '').trim()
      const qty = Number(form.get(`goods_qty_${i}`)) || 0
      const unitValueUsd = Number(form.get(`goods_usd_${i}`)) || 0
      const totalValueUsd = Number(form.get(`goods_total_${i}`)) || qty * unitValueUsd
      if (description) items.push({ description, qty, unitValueUsd, totalValueUsd })
    }
    startTransition(async () => {
      await updateGoods(ref_, items)
      setEditing(false)
    })
  }

  if (editing) {
    return (
      <div className="stack">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 className="h-sub">Description of Goods</h2>
          <button className="btn btn--sm btn--outline" type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit} className="stack">
          <GoodsTable initialData={goods ?? undefined} initialRows={goods ? goods.length : 5} />
          <div>
            <button className="btn" type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save goods'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (!goods || goods.length === 0) {
    return (
      <div className="stack">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 className="h-sub">Description of Goods</h2>
          <button className="btn btn--sm btn--outline" type="button" onClick={() => setEditing(true)}>
            Add goods
          </button>
        </div>
        <p className="form-note">No itemised goods recorded for this shipment.</p>
      </div>
    )
  }

  const grandTotal = goods.reduce((s, g) => s + g.totalValueUsd, 0)

  return (
    <div className="stack">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 className="h-sub">Description of Goods</h2>
        <button className="btn btn--sm btn--outline" type="button" onClick={() => setEditing(true)}>
          Edit
        </button>
      </div>
      <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: '#fff' }}>
        <table className="data">
          <thead>
            <tr>
              <th scope="col">Sr.</th>
              <th scope="col">Description</th>
              <th scope="col">Qty</th>
              <th scope="col">Unit Value (USD)</th>
              <th scope="col">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {goods.map((g, i) => (
              <tr key={i}>
                <td className="num">{i + 1}</td>
                <td>{g.description}</td>
                <td className="num">{g.qty > 0 ? g.qty : '—'}</td>
                <td className="num">{g.unitValueUsd > 0 ? `$${g.unitValueUsd.toFixed(2)}` : '—'}</td>
                <td className="num">{g.totalValueUsd > 0 ? `$${g.totalValueUsd.toFixed(2)}` : '—'}</td>
              </tr>
            ))}
          </tbody>
          {grandTotal > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right', fontWeight: 600, padding: '0.5rem 1rem', color: 'var(--body-2)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Grand Total
                </td>
                <td className="num" style={{ fontWeight: 700 }}>${grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
