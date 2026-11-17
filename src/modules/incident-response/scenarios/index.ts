import type { Scenario } from '../types'
import { phishingTakeover } from './phishingTakeover'
import { usbDrop } from './usbDrop'

// Add new scenarios here. They show up on screen in this order.
export const SCENARIOS: Scenario[] = [usbDrop, phishingTakeover]
