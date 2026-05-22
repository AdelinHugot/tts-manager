type Props = {
  label: string
  value: string
  trend?: number | null
  subtitle?: string
}

export default function KPICard({ label, value, trend, subtitle }: Props) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</div>
      <div className="text-2xl font-extrabold text-slate-900 mb-1">{value}</div>
      {trend != null && (
        <div className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs période préc.
        </div>
      )}
      {subtitle && trend == null && (
        <div className="text-xs text-slate-400">{subtitle}</div>
      )}
    </div>
  )
}
