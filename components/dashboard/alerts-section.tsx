import { AlertTriangle, Clock3, TrendingUp } from 'lucide-react'
import { AlertItem } from './alert-item'

interface AlertsSectionProps {
  onAction: (message: string) => void
}

export function AlertsSection({ onAction }: AlertsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-[#12263f]">À surveiller</h2>
          <p className="mt-1 text-xs text-slate-500">Actions recommandées</p>
        </div>

        <button
          type="button"
          onClick={() => onAction('Toutes les notifications sont marquées comme lues.')}
          className="text-xs font-bold text-[#0077b6] hover:underline"
        >
          Tout voir
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <AlertItem
          icon={AlertTriangle}
          tone="orange"
          title="Réservation en attente"
          detail="12 demandes à confirmer"
        />
        <AlertItem
          icon={Clock3}
          tone="blue"
          title="Embarquement prochain"
          detail="Melissa I · dans 45 minutes"
        />
        <AlertItem
          icon={TrendingUp}
          tone="green"
          title="Objectif dépassé"
          detail="+8,7 % ce mois-ci"
        />
      </div>
    </section>
  )
}
