import type { StatusTone } from '@/types'

interface StatusBadgeProps {
  status: string
  tone?: StatusTone | string
}

const TONE_CLASSES: Record<string, string> = {
  orange: 'bg-orange-50 text-orange-600',
  blue: 'bg-sky-50 text-[#0077b6]',
  green: 'bg-emerald-50 text-emerald-600',
}

export function StatusBadge({ status, tone = 'green' }: StatusBadgeProps) {
  const colorClass = TONE_CLASSES[tone] || 'bg-slate-100 text-slate-700'

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${colorClass}`}>
      {status}
    </span>
  )
}
