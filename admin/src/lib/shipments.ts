import type { ServiceMode } from '@/data/rates'

export type GoodsItem = {
  description: string
  qty: number
  unitValueUsd: number
  totalValueUsd: number
}

export const statuses = [
  'booked',
  'collected',
  'at-hub',
  'departed',
  'in-transit',
  'customs',
  'out-for-delivery',
  'delivered',
] as const

export type Status = (typeof statuses)[number]

export const statusLabels: Record<Status, string> = {
  booked: 'Booked',
  collected: 'Collected',
  'at-hub': 'At Faisalabad hub',
  departed: 'Departed origin',
  'in-transit': 'In transit',
  customs: 'Customs clearance',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
}

export type ShipmentEvent = {
  status: Status
  at: string
  location?: string
  note?: string
}

export type Party = {
  name: string
  phone: string
  email?: string
  address: string
  city: string
  country: string
}

export type Shipment = {
  ref: string
  createdAt: string
  status: Status
  confirmed: boolean
  sender: Party
  receiver: Party
  mode: ServiceMode
  pieces: number
  weightKg: number
  contents: string
  declaredValuePkr: number
  freightPkr: number | null
  estimatePkr: number | null
  pickupDate?: string
  goods: GoodsItem[] | null
  source: 'web' | 'manual'
  events: ShipmentEvent[]
}

export function formatRef(_date: Date, sequence: number) {
  return `AN${String(sequence).padStart(5, '0')}`
}

export function trackingUrl(ref: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://ancargoservices.com'
  return `${base.replace(/\/$/, '')}/track/${ref}`
}

export function statusIndex(status: Status) {
  return statuses.indexOf(status)
}
