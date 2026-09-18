import { Ship, Ticket, Users, WalletCards } from 'lucide-react'
import type { MetricCardData } from '@/types'
import { AlertsSection } from './alerts-section'
import { RevenueChart } from './revenue-chart'
import { StatCard } from './stat-card'
import { UpcomingTripsTable } from './upcoming-trips-table'

interface DashboardViewProps {
  onAction: (message: string) => void
}

const DASHBOARD_METRICS: MetricCardData[] = [
  {
    label: 'Traversées cette semaine',
    value: '24',
    change: '+12,5 %',
    icon: Ship,
  },
  {
    label: "Taux d'occupation moyen",
    value: '78 %',
    change: '+4,2 %',
    icon: Users,
  },
  {
    label: 'Revenus du mois',
    value: '12,8 M Ar',
    change: '+8,7 %',
    icon: WalletCards,
  },
  {
    label: 'Passagers à embarquer',
    value: '128',
    change: 'Aujourd’hui',
    icon: Ticket,
  },
]

export function DashboardView({ onAction }: DashboardViewProps) {
  return (
    <>
      {/* Top key performance indicators */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_METRICS.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      {/* Revenue chart and recommended actions */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <RevenueChart />
        <AlertsSection onAction={onAction} />
      </div>

      {/* Upcoming trips overview */}
      <UpcomingTripsTable onAction={onAction} />
    </>
  )
}
