export type Service = {
  slug: string
  name: string
  short: string
  summary: string
  card: string
  banner: string
  intro: string[]
  includes: string[]
  why: string[]
  closing: string
}

export const services: Service[] = [
  {
    slug: 'door-to-door-worldwide',
    name: 'Door-to-Door Worldwide',
    short: 'Collected from your address, delivered to theirs.',
    summary:
      'We collect from your door and deliver to the recipient’s door, handling packing, documentation and customs on the way.',
    card: '/images/svc-door-to-door.webp',
    banner: '/images/hero-door-to-door.webp',
    intro: [
      'Door-to-door is the simplest way to send cargo abroad: you never visit a depot, and you deal with one company from collection to delivery. AN Cargo Services collects from your address in Pakistan, packs the consignment for the journey, clears it through customs and delivers it to the recipient.',
      'It suits parcels and gifts going to family overseas as much as commercial consignments. Because we consolidate shipments heading to the same destination, door-to-door often costs less than sending the same box through a courier counter.',
    ],
    includes: [
      'Collection from your home, shop or factory anywhere in Pakistan',
      'Professional packing and labelling, included at no extra charge',
      'Export documentation and customs clearance at both ends',
      'Consolidation with other consignments to keep freight costs down',
      'Delivery to the recipient’s address, with proof of delivery',
    ],
    why: [
      'One point of contact — no handing off between agents',
      'Discounted rates for gifts, documents and household items',
      'Offices in Manchester, Dubai and Saudi Arabia to handle the delivery end',
      'Fifteen years of clearing consignments through the same ports',
    ],
    closing:
      'Send us the destination, the approximate weight and what is in the box, and we will come back with a firm rate and a collection date.',
  },
  {
    slug: 'air-cargo-courier',
    name: 'Air Cargo & Courier',
    short: 'Urgent parcels and documents, moving in days not weeks.',
    summary:
      'Air freight and courier for time-sensitive cargo, with weekly movements and DHL, FedEx, UPS and Aramex behind the network.',
    card: '/images/svc-air-cargo.webp',
    banner: '/images/hero-air-cargo.webp',
    intro: [
      'When something has to arrive quickly — documents, medicine, samples, a gift that has to be there for an occasion — air is the answer. AN Cargo Services books air cargo on scheduled weekly movements and hands smaller consignments to our courier partners.',
      'We handle both: full air cargo for consignments measured in hundreds of kilos, and courier for a single box. You get the same packing standards and the same person to call either way.',
    ],
    includes: [
      'Weekly air cargo movements from Pakistan to the UK, Gulf and Europe',
      'Courier service through DHL, FedEx, UPS and Aramex',
      'Same-week collection for urgent consignments',
      'Documents, parcels, samples and commercial air freight',
      'Tracking from collection through to delivery',
    ],
    why: [
      'Consolidated air cargo brings the per-kilo rate well below counter prices',
      'Direct relationships with all four major courier networks',
      'Advice on which service actually suits the deadline, rather than upselling',
      'Careful packing for fragile and high-value items',
    ],
    closing:
      'Tell us the deadline and the weight, and we will quote both air cargo and courier so you can see the difference before you commit.',
  },
  {
    slug: 'sea-cargo-fcl-lcl',
    name: 'Sea Cargo — FCL & LCL',
    short: 'Full or shared containers, at rates below market average.',
    summary:
      'Full container load and shared container groupage for household goods, commercial stock and anything where cost matters more than speed.',
    card: '/images/svc-sea-cargo.webp',
    banner: '/images/hero-sea-cargo.webp',
    intro: [
      'Sea freight is the most economical way to move volume. AN Cargo Services books both FCL — a container to yourself — and LCL, where your consignment shares a container with other cargo and you pay only for the space you use.',
      'LCL is what most families and small businesses need. We consolidate at our Faisalabad facility, load, ship, clear customs at the destination and deliver, either to a warehouse or to the door.',
    ],
    includes: [
      'FCL: 20ft and 40ft containers, port-to-port or door-to-door',
      'LCL groupage from as little as 10 kg',
      'Consolidation and warehousing at Faisalabad',
      'Customs clearance and duty handling at both ends',
      'Contractual monthly rates for regular commercial shippers',
    ],
    why: [
      'UK sea freight from PKR 550 per kg, with a 10 kg minimum',
      'Warehousing included while your consignment waits for the next sailing',
      'Transit typically 22–28 days to the UK',
      'Our own Manchester office receives and distributes UK-bound cargo',
    ],
    closing:
      'Ask for a rate by weight and destination. For regular shipments we will quote a contractual monthly rate rather than per-consignment pricing.',
  },
  {
    slug: 'port-to-port',
    name: 'Port-to-Port Delivery',
    short: 'You handle each end, we handle the crossing.',
    summary:
      'Port-to-port freight for shippers with their own clearing agents and transport at the destination.',
    card: '/images/svc-port-to-port.webp',
    banner: '/images/hero-port-to-port.webp',
    intro: [
      'Some shippers only need the middle of the journey. If you have a clearing agent and transport arranged at the destination, port-to-port strips out everything you do not need and prices accordingly.',
      'We take the consignment from the port of loading to the port of discharge, provide the bill of lading and the documentation your agent needs, and keep you updated on the sailing.',
    ],
    includes: [
      'Booking with the shipping line and container allocation',
      'Bill of lading and full export documentation',
      'Export clearance at the port of loading',
      'Sailing schedules and arrival notifications',
      'Optional marine insurance',
    ],
    why: [
      'The lowest-cost option when you already have agents in place',
      'Established relationships with lines calling at Karachi and Port Qasim',
      'Documentation prepared correctly the first time, so nothing sits at the port',
      'We can quote door-to-door alongside it so you can compare',
    ],
    closing:
      'Give us the ports, the commodity and the volume, and we will quote the crossing on its own.',
  },
  {
    slug: 'road-rail-cargo',
    name: 'Road & Rail Cargo',
    short: 'Overland freight within Pakistan and across the region.',
    summary:
      'Road and rail movements for domestic distribution and regional overland freight, including feeder legs to the ports.',
    card: '/images/svc-road-rail.webp',
    banner: '/images/hero-road-rail.webp',
    intro: [
      'Not every consignment crosses an ocean. AN Cargo Services moves cargo overland between Faisalabad, Lahore and Karachi, feeds consignments to the ports for onward sailing, and arranges regional road freight.',
      'Rail suits heavy, non-urgent volume; road suits everything that needs a specific delivery window. We will tell you which one actually fits.',
    ],
    includes: [
      'Domestic road freight between our Faisalabad, Lahore and Karachi offices',
      'Rail movements for heavy and bulk consignments',
      'Feeder legs from your premises to the port of loading',
      'Part loads and full loads',
      'Collection and delivery windows you can plan around',
    ],
    why: [
      'Our own network across three Pakistani cities',
      'Coordinated with sea and air bookings, so the handover is not your problem',
      'Suitable for commercial stock movements as well as household goods',
      'Transparent pricing by weight and distance',
    ],
    closing:
      'Tell us the pickup and delivery points and the weight, and we will quote road and rail side by side.',
  },
  {
    slug: 'postal-services',
    name: 'Postal Services',
    short: 'Letters, documents and small parcels, reliably.',
    summary:
      'Postal and small-parcel services for documents, letters, money orders and anything that does not justify a freight booking.',
    card: '/images/svc-postal.webp',
    banner: '/images/hero-postal.webp',
    intro: [
      'Small does not mean unimportant. Passports, contracts, certificates, bank documents and money orders all need to arrive intact and on time, and they need to be traceable.',
      'AN Cargo Services handles postal and small-parcel movements with the same documentation discipline as a container — logged, referenced and trackable from the counter to the recipient.',
    ],
    includes: [
      'Letters, legal documents and certificates',
      'Money orders and bank documentation',
      'Small parcels under the courier weight threshold',
      'Tracked and signed-for delivery',
      'Discounted rates for regular senders',
    ],
    why: [
      'Every item gets a reference and a tracking record, not just a stamp',
      'Advice on which documents need attestation before they travel',
      'Counter service at all three Pakistani offices',
      'Rates that make sense for a single envelope',
    ],
    closing:
      'Bring it to any of our offices, or ask us to collect. Either way you leave with a tracking reference.',
  },
  {
    slug: 'warehousing-clearance',
    name: 'Warehousing & Clearance',
    short: 'Storage while cargo waits, and customs handled at both ends.',
    summary:
      'Warehousing at our Faisalabad facility and customs clearance at both ends, sold on its own or bundled into a freight booking.',
    card: '/images/svc-warehousing.webp',
    banner: '/images/hero-warehousing.webp',
    intro: [
      'Cargo rarely moves the moment it is ready. Sailings run to a schedule, consolidations need filling, and paperwork takes the time it takes. Our Faisalabad facility holds consignments securely in the meantime, at contractual monthly rates for commercial shippers.',
      'Clearance is the other half of it. We prepare export documentation in Pakistan and clear at the destination, which is where most delays actually happen — almost always because of paperwork rather than policy.',
    ],
    includes: [
      'Secure warehousing at Faisalabad, charged monthly',
      'Consolidation of multiple consignments into one shipment',
      'Export documentation and declarations',
      'Customs clearance at destination',
      'Duty and tax handling, with the figures explained before they are due',
    ],
    why: [
      'Warehousing is included free while your cargo waits for the next sailing',
      'Fifteen years clearing through the same ports and customs posts',
      'Contractual month-wise rates for regular commercial volume',
      'Documentation prepared correctly the first time, so nothing sits at the port',
    ],
    closing:
      'Tell us the volume and how long you need it held, and we will quote storage and clearance separately from the freight.',
  },
]

/**
 * Explicit groupings so the home page never shows the same service twice, and
 * reordering the array cannot silently change which cards appear where.
 */
export const featuredSlugs = [
  'door-to-door-worldwide',
  'air-cargo-courier',
  'sea-cargo-fcl-lcl',
  'road-rail-cargo',
] as const

export const secondarySlugs = ['port-to-port', 'postal-services', 'warehousing-clearance'] as const

export const featuredServices = featuredSlugs.map((slug) => services.find((s) => s.slug === slug)!)
export const secondaryServices = secondarySlugs.map((slug) => services.find((s) => s.slug === slug)!)

export function getService(slug: string) {
  return services.find((s) => s.slug === slug)
}
