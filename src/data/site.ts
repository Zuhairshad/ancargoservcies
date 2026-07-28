export const site = {
  name: 'AN Cargo Services',
  shortName: 'ANCS',
  tagline: 'Your Logistics Partner',
  description:
    'Door-to-door cargo from Pakistan to the world. Air, sea, road and rail freight, courier and postal services, with safe packing and transparent pricing.',
  url: 'https://ancargoservices.com',
  email: 'info@ancargoservices.com',
  phone: '+92 41 8737799',
  phoneHref: '+92418737799',
  mobile: '+92 307 6998 742',
  whatsapp: '923076998742',
  yearsTrading: 15,
  destinations: '200+',
  address: {
    line1: '4-Z, 14/A Chenab Market',
    line2: 'Madina Town, Faisalabad',
    region: 'Punjab',
    country: 'Pakistan',
  },
  hours: [
    { days: 'Monday – Friday', time: '24/7' },
    { days: 'Saturday', time: '9:00 – 13:00' },
    { days: 'Sunday & holidays', time: '8:00 – 9:00' },
  ],
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    x: 'https://x.com',
  },
  couriers: ['DHL', 'FedEx', 'UPS', 'Aramex'],
} as const

export type Office = {
  city: string
  country: string
  head?: boolean
  address: string
  phone?: string
  whatsapp?: string
  /** Percentage position on the coverage map, from the top-left. */
  map: { x: number; y: number; flip?: boolean }
}

export const offices: Office[] = [
  {
    city: 'Faisalabad',
    country: 'Pakistan',
    head: true,
    address: '4-Z, 14/A Chenab Market, Madina Town, Faisalabad, Punjab',
    phone: '+92 41 8737799',
    whatsapp: '923076998742',
    map: { x: 68.9, y: 44.9 },
  },
  {
    city: 'Lahore',
    country: 'Pakistan',
    address: 'Lahore, Punjab',
    whatsapp: '923076998742',
    map: { x: 71.5, y: 56 },
  },
  {
    city: 'Karachi',
    country: 'Pakistan',
    address: 'Karachi, Sindh',
    whatsapp: '923076998742',
    map: { x: 64, y: 70.2 },
  },
  {
    city: 'Manchester',
    country: 'United Kingdom',
    address: 'Manchester, England',
    map: { x: 29.3, y: 26, flip: true },
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Dubai, UAE',
    map: { x: 52.9, y: 62.5, flip: true },
  },
  {
    city: 'Riyadh',
    country: 'Saudi Arabia',
    address: 'Saudi Arabia',
    map: { x: 44.4, y: 51.9, flip: true },
  },
]

export const nav = {
  primary: [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/why-choose-us', label: 'Why Choose Us' },
  ],
  secondary: [
    { href: '/rates', label: 'Rates' },
    { href: '/offices', label: 'Offices' },
  ],
  more: [
    { href: '/book', label: 'Book A Shipment' },
    { href: '/track', label: 'Track' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
  footer: [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/rates', label: 'Rates' },
    { href: '/book', label: 'Book A Shipment' },
    { href: '/track', label: 'Track' },
    { href: '/offices', label: 'Offices' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/terms', label: 'Terms Of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
}

/**
 * Only numbers we can stand behind from the current site. Deliberately no
 * "parcels delivered" or "happy clients" figure until ANCS supplies a real one —
 * the old WordPress site rendered those as literal "00".
 */
export const stats = [
  { value: '15+', label: 'Years In Operation' },
  { value: '6', label: 'Offices, 3 Countries' },
  { value: '4', label: 'Modes Of Transport' },
  { value: '200+', label: 'Destinations Served' },
  { value: '4', label: 'Courier Partners' },
  { value: '24/7', label: 'Support, Mon–Fri' },
]

export function whatsappLink(message: string, number: string = site.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
