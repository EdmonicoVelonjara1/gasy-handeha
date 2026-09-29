import { Ticket } from 'lucide-react'

interface PassengerScreenProps {
  onBack: () => void
}

export function PassengerScreen({ onBack }: PassengerScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fb] px-5 py-10 text-[#12263f]">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e7f7fa] text-[#0077b6]">
          <Ticket className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.05em]">
          Espace passager
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          La recherche et la réservation de traversées arrivent bientôt. Votre espace est prêt à vous accueillir.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-8 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6]"
        >
          Changer d’espace
        </button>
      </section>
    </main>
  )
}
