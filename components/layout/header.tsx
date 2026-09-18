import { Bell, ChevronDown, Menu } from 'lucide-react'

interface HeaderProps {
  profileOpen: boolean
  onToggleProfile: () => void
  onOpenSidebar: () => void
  onAction: (message: string) => void
}

export function Header({
  profileOpen,
  onToggleProfile,
  onOpenSidebar,
  onAction,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur lg:px-9">
      {/* Left side: Hamburger and Greetings */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </button>

        <div>
          <p className="hidden text-xs font-medium text-slate-400 sm:block">
            Mardi 22 octobre 2025
          </p>
          <p className="text-sm font-bold sm:hidden">Espace compagnie</p>
          <p className="hidden text-[11px] text-slate-500 sm:block">
            Bonne journée, équipe Melissa Express
          </p>
        </div>
      </div>

      {/* Right side: Notifications & Profile Dropdown */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onAction('Vous avez 3 nouvelles notifications.')}
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-[#12263f]"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#f28c5b]" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleProfile}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 text-left transition hover:bg-slate-50"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-[#dff4fb] text-xs font-extrabold text-[#0077b6]">
              ME
            </span>
            <span className="hidden text-xs font-bold sm:block">Melissa Express</span>
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-xl animate-in fade-in-50 zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  onAction('Profil ouvert')
                  onToggleProfile()
                }}
                className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 hover:text-[#0077b6]"
              >
                Mon profil
              </button>
              <button
                type="button"
                onClick={() => {
                  onAction('Paramètres ouverts')
                  onToggleProfile()
                }}
                className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 hover:text-[#0077b6]"
              >
                Paramètres
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
