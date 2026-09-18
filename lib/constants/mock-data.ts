import {
  LayoutDashboard,
  Ship,
  Ticket,
  Users,
  WalletCards,
} from 'lucide-react'
import type { Booking, NavItem, RevenueDataPoint, Trip } from '@/types'

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: "Vue d'ensemble", icon: LayoutDashboard },
  { label: 'Mes traversées', icon: Ship },
  { label: 'Réservations', icon: Ticket, badge: 12 },
  { label: 'Passagers', icon: Users },
  { label: 'Revenus', icon: WalletCards },
]

export const REVENUE_DATA: RevenueDataPoint[] = [
  { day: 'Lun', value: 420 },
  { day: 'Mar', value: 610 },
  { day: 'Mer', value: 540 },
  { day: 'Jeu', value: 760 },
  { day: 'Ven', value: 680 },
  { day: 'Sam', value: 920 },
  { day: 'Dim', value: 810 },
]

export const UPCOMING_TRIPS: Trip[] = [
  {
    id: 'R1',
    route: 'Toamasina → Sainte-Marie',
    date: 'Aujourd’hui, 07:30',
    boat: 'Melissa I',
    capacity: '32 / 40',
    status: 'Embarquement',
    tone: 'blue',
  },
  {
    id: 'R2',
    route: 'Toamasina → Maroantsetra',
    date: 'Aujourd’hui, 14:00',
    boat: 'Melissa II',
    capacity: '48 / 60',
    status: 'Planifiée',
    tone: 'green',
  },
  {
    id: 'R3',
    route: 'Sainte-Marie → Toamasina',
    date: 'Demain, 08:15',
    boat: 'Melissa I',
    capacity: '19 / 40',
    status: 'Planifiée',
    tone: 'green',
  },
  {
    id: 'R4',
    route: 'Toamasina → Sainte-Marie',
    date: 'Demain, 16:30',
    boat: 'Melissa II',
    capacity: '60 / 60',
    status: 'Complète',
    tone: 'orange',
  },
]

export const RECENT_BOOKINGS: Booking[] = [
  {
    id: 'MB-4821',
    name: 'Aina Rakoto',
    route: 'Toamasina → Sainte-Marie',
    seats: 2,
    amount: '170 000 Ar',
    status: 'Confirmée',
    initials: 'AR',
  },
  {
    id: 'MB-4820',
    name: 'Lova Andriam',
    route: 'Toamasina → Maroantsetra',
    seats: 1,
    amount: '145 000 Ar',
    status: 'En attente',
    initials: 'LA',
  },
  {
    id: 'MB-4819',
    name: 'Mamy Rasoanaivo',
    route: 'Sainte-Marie → Toamasina',
    seats: 4,
    amount: '340 000 Ar',
    status: 'Confirmée',
    initials: 'MR',
  },
]
