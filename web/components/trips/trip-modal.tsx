'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface TripModalProps {
  onClose: () => void
  onSave: (tripData: {
    route: string
    departureDate: string
    departureTime: string
    boat: string
    price: string
  }) => void
}

export function TripModal({ onClose, onSave }: TripModalProps) {
  const [route, setRoute] = useState('Toamasina → Sainte-Marie')
  const [departureDate, setDepartureDate] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [boat, setBoat] = useState('Melissa I')
  const [price, setPrice] = useState('85 000 Ar')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      route,
      departureDate,
      departureTime,
      boat,
      price,
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 grid place-items-center bg-[#12263f]/35 p-4 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0077b6]">
              Nouvelle traversée
            </p>
            <h2 id="modal-title" className="mt-1 text-2xl font-extrabold text-[#12263f]">
              Planifier un départ
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-slate-500">Route</span>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]"
              >
                <option value="Toamasina → Sainte-Marie">Toamasina → Sainte-Marie</option>
                <option value="Toamasina → Maroantsetra">Toamasina → Maroantsetra</option>
                <option value="Sainte-Marie → Toamasina">Sainte-Marie → Toamasina</option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-500">Date de départ</span>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-500">Heure</span>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-500">Bateau</span>
              <select
                value={boat}
                onChange={(e) => setBoat(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]"
              >
                <option value="Melissa I">Melissa I</option>
                <option value="Melissa II">Melissa II</option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-500">Prix par siège</span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="85 000 Ar"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none placeholder:text-slate-300 transition focus:border-[#0077b6] focus:ring-1 focus:ring-[#0077b6]"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0077b6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00679e] focus:ring-2 focus:ring-[#0077b6]"
            >
              Créer la traversée
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
