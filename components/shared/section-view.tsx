'use client'

import { useState } from 'react'
import { MoreHorizontal, Search } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { RECENT_BOOKINGS, UPCOMING_TRIPS } from '@/lib/constants/mock-data'
import type { Booking, Trip } from '@/types'

interface SectionViewProps {
  active: string
  onAction: (message: string) => void
}

interface DisplayRow {
  key: string
  avatarText: string
  title: string
  subtitle: string
  details: string
  metric: string
  status: string
  tone: string
}

export function SectionView({ active, onAction }: SectionViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const isBookings = active === 'Réservations'
  const isPassengers = active === 'Passagers'

  const rows: DisplayRow[] = isBookings
    ? RECENT_BOOKINGS.map((booking: Booking) => ({
        key: booking.id,
        avatarText: booking.initials,
        title: booking.name,
        subtitle: booking.id,
        details: booking.route,
        metric: booking.amount,
        status: booking.status,
        tone: booking.status === 'Confirmée' ? 'green' : 'orange',
      }))
    : isPassengers
      ? RECENT_BOOKINGS.map((booking: Booking) => ({
          key: booking.id,
          avatarText: booking.initials,
          title: booking.name,
          subtitle: 'Passager régulier',
          details: `${booking.seats + 1} réservations`,
          metric: 'Depuis oct. 2024',
          status: 'Actif',
          tone: 'green',
        }))
      : UPCOMING_TRIPS.map((trip: Trip) => ({
          key: trip.id,
          avatarText: 'ME',
          title: trip.route,
          subtitle: trip.date,
          details: trip.boat,
          metric: trip.capacity,
          status: trip.status,
          tone: trip.tone,
        }))

  const filteredRows = rows.filter((row) =>
    row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.details.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const firstColumnHeader = isPassengers ? 'Passager' : 'Référence'
  const secondColumnHeader = isPassengers ? 'Réservations' : 'Détails'
  const thirdColumnHeader = isPassengers ? 'Dépenses' : 'Places / Montant'

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-extrabold text-[#12263f]">{active}</h2>
          <p className="mt-1 text-xs text-slate-500">Gérez les données de votre compagnie.</p>
        </div>

        <div className="flex gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-400 focus-within:border-[#0077b6] focus-within:text-slate-600">
            <Search className="size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-28 bg-transparent outline-none placeholder:text-slate-400 sm:w-40"
              placeholder="Rechercher"
            />
          </label>
          <button
            type="button"
            onClick={() => onAction('Filtres appliqués.')}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Filtrer
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th scope="col" className="pb-3">{firstColumnHeader}</th>
              <th scope="col" className="pb-3">{secondColumnHeader}</th>
              <th scope="col" className="pb-3">{thirdColumnHeader}</th>
              <th scope="col" className="pb-3">Statut</th>
              <th scope="col" className="pb-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                  Aucun résultat trouvé pour « {searchQuery} »
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.key} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-[#e7f7fa] text-[11px] font-bold text-[#0077b6]">
                        {row.avatarText}
                      </span>
                      <div>
                        <p className="font-bold text-[#12263f]">{row.title}</p>
                        <p className="text-xs text-slate-400">{row.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-600">{row.details}</td>
                  <td className="py-4 font-semibold">{row.metric}</td>
                  <td className="py-4">
                    <StatusBadge status={row.status} tone={row.tone} />
                  </td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onAction(`Action effectuée pour ${row.title}`)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#0077b6]"
                      aria-label="Plus d'actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
