import {
  Anchor,
  ChevronDown,
  CircleHelp,
  LogOut,
  Settings,
  Ship,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { NAVIGATION_ITEMS } from '@/lib/constants/mock-data'
import type { NavSection } from '@/types'

interface SidebarProps {
  activeSection: string
  isOpen: boolean
  onSelectSection: (section: NavSection) => void
  onClose: () => void
  onAction: (message: string) => void
}

export function Sidebar({
  activeSection,
  isOpen,
  onSelectSection,
  onClose,
  onAction,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-[#12263f]/30 lg:hidden"
        />
      )}

      {/* Sidebar navigation panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Brand */}
        <div className="flex h-[88px] items-center gap-3 border-b border-slate-100 px-6">
          <span className="grid size-10 place-items-center rounded-xl bg-[#0077b6] text-white shadow-lg shadow-sky-100">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="" />
          </span>
          <span className="text-[22px] font-extrabold tracking-[-0.05em] text-[#0077b6]">
            Gasy<span className="text-[#12263f]">Handeha</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Company identity card */}
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3 rounded-xl bg-[#eef9fc] p-3">
            <span className="grid size-10 place-items-center rounded-lg bg-white text-[#0077b6] shadow-sm">
              <Ship className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">Melissa Express</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Compagnie maritime</p>
            </div>
            <ChevronDown className="ml-auto size-4 text-slate-400" />
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5" aria-label="Navigation compagnie">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Gestion
          </p>

          {NAVIGATION_ITEMS.map(({ label, icon: Icon, badge }) => {
            const isActive = activeSection === label

            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  onSelectSection(label)
                  onClose()
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#e7f7fa] text-[#0077b6]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#12263f]'
                }`}
              >
                <Icon className="size-[18px]" />
                <span>{label}</span>
                {badge && (
                  <span className="ml-auto rounded-full bg-[#f28c5b] px-2 py-0.5 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            )
          })}

          <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Compte
          </p>

          <button
            type="button"
            onClick={() => onAction('Les paramètres seront bientôt disponibles.')}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-[#12263f]"
          >
            <Settings className="size-[18px]" />
            <span>Paramètres</span>
          </button>

          <button
            type="button"
            onClick={() => onAction('Centre d’aide ouvert.')}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-[#12263f]"
          >
            <CircleHelp className="size-[18px]" />
            <span>Centre d’aide</span>
          </button>
        </nav>

        {/* Footer logout */}
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={() => onAction('Déconnexion simulée.')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-red-500"
          >
            <LogOut className="size-[18px]" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
    </>
  )
}
