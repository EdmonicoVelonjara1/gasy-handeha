import { Anchor, ArrowUpRight, Ship, Ticket } from 'lucide-react'
import Image from 'next/image'
import type { UserRole } from '@/types'

interface WelcomeScreenProps {
  onSelectRole: (role: UserRole) => void
}

export function WelcomeScreen({ onSelectRole }: WelcomeScreenProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8fb] px-5 py-10 text-[#12263f]">
      {/* Background ambient blurs */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[#dff4fb] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full bg-[#fff0e8] blur-3xl" />

      <section className="relative w-full max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-xl bg-[#0077b6] text-white shadow-xl shadow-sky-100">
            <Image src="/icon-dark-32x32.png" alt="Logo" width={45} height={45} className="" />
          </span>
          <p className="mt-5 text-2xl font-extrabold tracking-[-0.05em] text-[#0077b6]">
            Gasy<span className="text-[#12263f]">Handeha</span>
          </p>
          <p className="mt-8 text-sm font-bold text-[#0077b6]">Bienvenue à bord</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl">
            Que souhaitez-vous faire ?
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Choisissez votre espace pour accéder à une expérience adaptée à vos besoins.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelectRole('passenger')}
            className="group rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#8dd8e8] hover:shadow-xl hover:shadow-sky-100/60 sm:p-9"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-[#e7f7fa] text-[#0077b6] transition group-hover:bg-[#0077b6] group-hover:text-white">
              <Ticket className="size-7" />
            </span>
            <h2 className="mt-7 text-2xl font-extrabold">Je suis passager</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Recherchez une traversée, réservez vos billets et suivez votre voyage.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#0077b6]">
              Accéder à l’espace passager{' '}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole('company')}
            className="group rounded-3xl border border-[#b7e5ee] bg-[#eef9fc] p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#0077b6] hover:shadow-xl hover:shadow-sky-100/60 sm:p-9"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-[#0077b6] text-white shadow-lg shadow-sky-100">
              <Ship className="size-7" />
            </span>
            <h2 className="mt-7 text-2xl font-extrabold">Je suis une compagnie</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Gérez vos traversées, vos réservations, vos passagers et vos revenus.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#0077b6]">
              Accéder à l’espace compagnie{' '}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          La plateforme maritime et routière qui relie Madagascar à ses îles.
        </p>
      </section>
    </main>
  )
}
