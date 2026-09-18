'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { PassengerScreen } from '@/components/screens/passenger-screen'
import { WelcomeScreen } from '@/components/screens/welcome-screen'
import { SectionView } from '@/components/shared/section-view'
import { ToastNotification } from '@/components/shared/toast-notification'
import { TripModal } from '@/components/trips/trip-modal'
import type { NavSection, UserRole } from '@/types'

export default function Page() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [activeSection, setActiveSection] = useState<NavSection>("Vue d'ensemble")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const notify = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(''), 3200)
  }

  // 1. Role Selection Screen
  if (!role) {
    return <WelcomeScreen onSelectRole={setRole} />
  }

  // 2. Passenger View
  if (role === 'passenger') {
    return <PassengerScreen onBack={() => setRole(null)} />
  }

  // 3. Company Backoffice
  return (
    <main className="min-h-screen bg-[#f5f8fb] text-[#12263f]">
      {/* Navigation Sidebar */}
      <Sidebar
        activeSection={activeSection}
        isOpen={sidebarOpen}
        onSelectSection={setActiveSection}
        onClose={() => setSidebarOpen(false)}
        onAction={notify}
      />

      {/* Main Content Area */}
      <div className="lg:pl-[260px]">
        <Header
          profileOpen={profileOpen}
          onToggleProfile={() => setProfileOpen((prev) => !prev)}
          onOpenSidebar={() => setSidebarOpen(true)}
          onAction={notify}
        />

        <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-9 lg:py-10">
          {/* Section Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-bold text-[#0077b6]">Espace compagnie</p>
              <h1 className="text-3xl font-extrabold tracking-[-0.05em] sm:text-[36px]">
                {activeSection}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Pilotez votre activité maritime en toute simplicité.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0077b6] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-[#00679e]"
            >
              <Plus className="size-4" />
              <span>Créer une traversée</span>
            </button>
          </div>

          {/* Active Section Content */}
          {activeSection === "Vue d'ensemble" ? (
            <DashboardView onAction={notify} />
          ) : (
            <SectionView active={activeSection} onAction={notify} />
          )}
        </div>
      </div>

      {/* Trip Creation Modal Dialog */}
      {modalOpen && (
        <TripModal
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false)
            notify('La nouvelle traversée a été créée.')
          }}
        />
      )}

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} />
    </main>
  )
}
