export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: string
  image: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'how-to-pack-a-parcel-for-sea-freight',
    title: 'How to pack a parcel that survives sea freight',
    excerpt:
      'A carton crossing the ocean is handled a dozen times and sits in a container for a month. Here is how to pack so it arrives in one piece.',
    date: '2026-06-18',
    readingTime: '4 min read',
    image: '/images/post-packing.webp',
    body: [
      'A parcel going by sea is not the same as a parcel going across town. It will be lifted, stacked, driven, craned and stored, often under other cargo, for three to four weeks. Most damage we see is not rough handling — it is packing that was never meant to last that long.',
      'Use double-wall cartons. Single-wall boxes from a supermarket are fine for a courier envelope going 20 kilometres; they are not fine for a container. Fill every void so nothing shifts, because a half-empty box collapses under the weight of the one above it.',
      'Wrap anything fragile individually, not as a group. Tape all seams along the length and across both ends. Write the destination on the carton itself as well as on the label, because labels come off.',
      'Declare what is inside honestly. An inaccurate declaration is the single most common reason a consignment gets held at customs, and a held consignment costs more in storage than the duty you were trying to avoid.',
    ],
  },
  {
    slug: 'sea-or-air-which-should-you-choose',
    title: 'Sea or air: which should you actually choose?',
    excerpt:
      'Air is faster and sea is cheaper, but the honest answer depends on weight, deadline and what is in the box.',
    date: '2026-05-27',
    readingTime: '3 min read',
    image: '/images/post-sea-or-air.webp',
    body: [
      'The rule of thumb: if the consignment is under about 30 kg and needed within a fortnight, air usually wins on total cost once you account for the value of arriving on time. Above that weight, sea pulls ahead quickly, and the gap widens with every kilo.',
      'Weight is not the only factor. Air freight is charged on volumetric weight as well as actual weight, so a light but bulky consignment — bedding, clothing, cushions — can cost far more by air than the scales suggest. Sea is far more forgiving of volume.',
      'Deadlines matter more than people admit. If something has to be there for a wedding or an exam, book air and stop calculating. If it is household goods being sent ahead of a move, sea is the obvious choice.',
      'Ask us to quote both. We do it as standard, so you can see the two numbers side by side before you decide.',
    ],
  },
  {
    slug: 'what-documents-you-need-to-send-cargo-abroad',
    title: 'What documents you need to send cargo abroad',
    excerpt:
      'Most delays at customs are paperwork, not policy. Here is the list, and what each document is actually for.',
    date: '2026-04-30',
    readingTime: '5 min read',
    image: '/images/post-documents.webp',
    body: [
      'Every consignment leaving Pakistan needs a packing list and a commercial or personal invoice. The packing list says what is in each carton; the invoice says what it is worth. Customs at both ends read these two documents before anything else.',
      'For commercial shipments you will also need your NTN, an export declaration and, depending on the commodity, a certificate of origin. For personal effects, a copy of the sender’s ID and the recipient’s ID is usually enough.',
      'Some destinations require attestation on documents before they travel — educational certificates going to the Gulf are the common example. Attestation takes days, not hours, so start it before you book the freight.',
      'We prepare the export documentation as part of every door-to-door and sea freight booking. If you are shipping port-to-port, we provide the bill of lading and you or your agent handle the destination paperwork.',
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
