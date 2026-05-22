import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  affiliée: number
  pub_shopping: number
}

const COLORS = ['#3B5BFF', '#a5b4fc']

export default function DonutChart({ affiliée, pub_shopping }: Props) {
  const total = affiliée + pub_shopping
  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-300 text-sm">
        Aucune donnée pour cette période
      </div>
    )
  }
  const pctAff = Math.round((affiliée / total) * 100)
  const pctPub = 100 - pctAff
  const data = [
    { name: 'Affiliée', value: affiliée },
    { name: 'Pub Shopping', value: pub_shopping },
  ]

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => [`${v} commandes`, '']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B5BFF]" />
          <span className="text-slate-600 font-medium">Affiliée {pctAff}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#a5b4fc]" />
          <span className="text-slate-600 font-medium">Pub {pctPub}%</span>
        </div>
      </div>
    </div>
  )
}
