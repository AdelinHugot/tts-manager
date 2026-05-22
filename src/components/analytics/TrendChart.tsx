import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { WeeklyPoint } from '../../types/analytics'

type Props = { data: WeeklyPoint[] }

function EuroTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <div className="font-semibold text-slate-700 mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name} : {p.value.toFixed(2)} €
        </div>
      ))}
    </div>
  )
}

export default function TrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-300 text-sm">
        Aucune donnée pour cette période
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
        <Tooltip content={<EuroTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
        <Line type="monotone" dataKey="ca" name="CA" stroke="#3B5BFF" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="commissions" name="Commissions" stroke="#a5b4fc" strokeWidth={2} dot={false} strokeDasharray="4 2" activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
