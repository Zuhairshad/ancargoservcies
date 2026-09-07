export type ServiceMode = 'sea-lcl' | 'sea-fcl' | 'air-cargo' | 'courier' | 'door-to-door'

export const modeLabels: Record<ServiceMode, string> = {
  'sea-lcl': 'Sea — LCL (shared container)',
  'sea-fcl': 'Sea — FCL (full container)',
  'air-cargo': 'Air cargo',
  courier: 'Courier',
  'door-to-door': 'Door-to-door',
}
