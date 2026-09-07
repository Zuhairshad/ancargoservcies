export const site = {
  name: 'AN Cargo Services',
  shortName: 'ANCS',
  email: 'info@ancargoservices.com',
  phone: '+92 41 8737799',
  mobile: '+92 307 6998 742',
  whatsapp: '923076998742',
  address: {
    line1: '4-Z, 14/A Chenab Market',
    line2: 'Madina Town, Faisalabad',
    region: 'Punjab',
    country: 'Pakistan',
  },
} as const

export function whatsappLink(message: string, number: string = site.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
