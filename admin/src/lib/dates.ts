const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso))
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${dateFmt.format(d)}, ${timeFmt.format(d)}`
}

export function formatLabelDate(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${String(d.getUTCFullYear()).slice(2)}`
}
