import type { LucideIcon } from 'lucide-react'

export type UserRole = 'passenger' | 'company'

export type NavSection = "Vue d'ensemble" | 'Mes traversées' | 'Réservations' | 'Passagers' | 'Revenus'

export interface NavItem {
  label: NavSection
  icon: LucideIcon
  badge?: number
}

export type StatusTone = 'blue' | 'green' | 'orange'

export interface Trip {
  id: string
  route: string
  date: string
  boat: string
  capacity: string
  status: string
  tone: StatusTone
}

export interface Booking {
  id: string
  name: string
  route: string
  seats: number
  amount: string
  status: string
  initials: string
}

export interface MetricCardData {
  label: string
  value: string
  change: string
  icon: LucideIcon
}

export interface RevenueDataPoint {
  day: string
  value: number
}
