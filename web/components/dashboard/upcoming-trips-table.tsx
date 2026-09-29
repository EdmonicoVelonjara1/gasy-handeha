import { ArrowUpRight, MoreHorizontal } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { UPCOMING_TRIPS } from '@/lib/constants/mock-data'

interface UpcomingTripsTableProps {
  onAction: (message: string) => void
}

export function UpcomingTripsTable({ onAction }: UpcomingTripsTableProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-[#12263f]">Prochaines traversées</h2>
          <p className="mt-1 text-xs text-slate-500">Aujourd’hui et demain</p>
        </div>

        <button
          type="button"
          onClick={() => onAction('Ouverture de la liste des traversées.')}
          className="inline-flex items-center text-xs font-bold text-[#0077b6] hover:underline"
        >
          Gérer tout <ArrowUpRight className="ml-1 size-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th scope="col" className="pb-3">Traversée</th>
              <th scope="col" className="pb-3">Bateau</th>
              <th scope="col" className="pb-3">Capacité</th>
              <th scope="col" className="pb-3">Statut</th>
              <th scope="col" className="pb-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {UPCOMING_TRIPS.map((trip) => (
              <tr key={trip.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="py-4">
                  <p className="font-bold text-[#12263f]">{trip.route}</p>
                  <p className="mt-1 text-xs text-slate-400">{trip.date}</p>
                </td>
                <td className="py-4 text-slate-600">{trip.boat}</td>
                <td className="py-4 font-semibold">
                  {trip.capacity}{' '}
                  <span className="text-xs font-normal text-slate-400">places</span>
                </td>
                <td className="py-4">
                  <StatusBadge status={trip.status} tone={trip.tone} />
                </td>
                <td className="py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onAction(`Détails de ${trip.route}`)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#0077b6]"
                    aria-label={`Plus d'options pour ${trip.route}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
