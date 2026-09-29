import { Check } from 'lucide-react'

interface ToastNotificationProps {
  message: string
}

export function ToastNotification({ message }: ToastNotificationProps) {
  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#12263f] px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2"
    >
      <Check className="size-4 text-emerald-300" />
      <span>{message}</span>
    </div>
  )
}
