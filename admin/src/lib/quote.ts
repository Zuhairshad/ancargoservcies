export const pkr = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 })

export function formatPkr(amount: number) {
  return `PKR ${pkr.format(amount)}`
}
