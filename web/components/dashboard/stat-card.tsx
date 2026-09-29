import type { MetricCardData } from '@/types'

export function StatCard({ label, value, change, icon: Icon }: MetricCardData) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-[#e7f7fa] text-[#0077b6]">
          <Icon className="size-5" />
        </span>
        <span className="text-xs font-bold text-emerald-600">{change}</span>
      </div>
      <p className="mt-5 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  )
}
