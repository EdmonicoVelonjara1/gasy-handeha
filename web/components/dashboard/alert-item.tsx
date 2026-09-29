import type { LucideIcon } from 'lucide-react'
import type { StatusTone } from '@/types'

interface AlertItemProps {
  icon: LucideIcon
  tone: StatusTone
  title: string
  detail: string
}

const TONE_STYLES: Record<StatusTone, string> = {
  orange: 'bg-orange-50 text-orange-500',
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-sky-50 text-[#0077b6]',
}

export function AlertItem({ icon: Icon, tone, title, detail }: AlertItemProps) {
  const colorClass = TONE_STYLES[tone] || TONE_STYLES.blue

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3 transition hover:bg-slate-100/60">
      <span className={`grid size-9 place-items-center rounded-lg ${colorClass}`}>
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs font-bold text-[#12263f]">{title}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p>
      </div>
    </div>
  )
}
