type IconProps = { className?: string }

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M2 8.5h13M9.5 3l5.5 5.5L9.5 14" />
    </svg>
  )
}

export function ChevronDown({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 6.5l4 4 4-4" />
    </svg>
  )
}

export function Burger() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" width="18" height="18">
      <path d="M1 4h16M1 9h16M1 14h16" />
    </svg>
  )
}

export function WhatsApp({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 17 17" fill="currentColor" aria-hidden="true">
      <path d="M8.5 1a7.5 7.5 0 0 0-6.4 11.4L1 16l3.7-1a7.5 7.5 0 1 0 3.8-14zm4.3 10.6c-.2.5-1 1-1.5 1-.4 0-.9 0-1.6-.3a11 11 0 0 1-4.4-3.9C4.6 7.5 4.4 6.7 4.6 6c.1-.5.5-.9.8-1 .2-.1.6-.1.8.3l.5 1.2c.1.3 0 .5-.1.7l-.3.4c-.1.1-.2.3 0 .5.4.7 1.4 1.6 2.2 1.9.2.1.4 0 .5-.1l.4-.5c.2-.2.4-.2.6-.1l1.2.6c.4.2.4.5.3.8z" />
    </svg>
  )
}

export function Truck({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M1 5h11v9H1zM12 8h4l3 3v3h-7z" />
      <circle cx="5" cy="16" r="1.6" />
      <circle cx="15" cy="16" r="1.6" />
    </svg>
  )
}

export function Plane({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M10 1.5l1.8 7.2L19 10.7v1.8l-6.8-1.2L10 18.5l-2.2-7.2L1 12.5v-1.8l7.2-2z" />
    </svg>
  )
}

export function Ship({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 11l1.4 5.5h13.2L18 11zM5 11V5h10v6M10 5V2" />
    </svg>
  )
}

export function Train({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2.5 3h15v8h-15zM6 17h8M10 11v6M6 6h8" />
    </svg>
  )
}

export function Envelope({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 4.5h16v11H2zM2 5l8 6 8-6" />
    </svg>
  )
}

export function Anchor({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="10" cy="4" r="2" />
      <path d="M10 6v12M4 11a6 6 0 0 0 12 0M6 9H3M17 9h-3" />
    </svg>
  )
}

/** Slug → icon, so service lists stay in sync with the data file. */
export const serviceIcons: Record<string, (p: IconProps) => React.JSX.Element> = {
  'door-to-door-worldwide': Truck,
  'air-cargo-courier': Plane,
  'sea-cargo-fcl-lcl': Ship,
  'port-to-port': Anchor,
  'road-rail-cargo': Train,
  'postal-services': Envelope,
}
